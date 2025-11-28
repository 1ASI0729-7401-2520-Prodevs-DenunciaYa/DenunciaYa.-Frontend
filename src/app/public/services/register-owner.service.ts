import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegisterOwnerService {
  private apiUrl = 'http://localhost:8080/api/v1/authentication';
  private profileUrl = 'http://localhost:8080/api/v1/profiles';
  private currentUserId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

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
    return this.http.post<any>(`${this.apiUrl}/sign-in`, {
      username: email,
      password: password
    }).pipe(
      tap(response => {
        const token = response.token;
        localStorage.setItem('token', token);

        // ✅ Extraer el username desde el JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        // ✅ Guardar el username en el localStorage
        localStorage.setItem('currentUser', username);
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
