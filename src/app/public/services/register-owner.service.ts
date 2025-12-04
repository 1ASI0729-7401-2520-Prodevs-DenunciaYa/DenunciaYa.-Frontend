import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterOwnerService {
  private apiUrl = `${environment.apiBaseUrl}/authentication`;
  private profileUrl = `${environment.apiBaseUrl}/profiles`;
  private currentUserId: number | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  // Registrar nuevo usuario (Owner)
  addUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sign-up`, userData);
  }

  // Guardar ID actual del usuario registrado (si necesitas reutilizarlo)
  setCurrentUserId(id: number) {
    this.currentUserId = id;
  }

  addimageprofile(profileData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<any>(this.profileUrl, profileData, { headers });
  }



  // Iniciar sesión del usuario
  login(email: string, password: string): Observable<any> {
    // El backend espera username y password, username es el email
    const payload = { username: email, password };
    const url = `${environment.apiBaseUrl}/authentication/sign-in`;
    return this.http.post<any>(url, payload).pipe(
      map(res => {
        if (!res || !res.token) {
          throw new Error('No se recibió token en la respuesta del servidor.');
        }
        this.authService.setToken(res.token);
        return res;
      }),
      catchError(err => {
        // Mostrar mensaje real del backend si existe
        let message = 'Error desconocido';
        if (err?.error && typeof err.error === 'object') {
          message = err.error.message || JSON.stringify(err.error);
        } else if (err?.message) {
          message = err.message;
        }
        const status = err?.status ?? null;
        console.warn('[RegisterOwnerService] login failed', status, message);
        return throwError(() => new Error(`(${status}) ${message}`));
      })
    );
  }

   // Cerrar sesión: eliminar token e ID, redirigir si es necesario
   logout(): void {
     localStorage.removeItem('token');
     localStorage.removeItem('onid');
     localStorage.removeItem('currentUser'); // También esto, si lo guardas
     this.currentUserId = null;
     this.router.navigate(['/pages/login-owner']); // Redirige al login
   }

   // Verifica si el usuario está autenticado
   isLoggedIn(): boolean {
     return !!localStorage.getItem('token');
   }

 }
