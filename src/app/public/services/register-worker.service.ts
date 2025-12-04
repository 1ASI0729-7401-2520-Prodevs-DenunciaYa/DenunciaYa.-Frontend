import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, from, lastValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterWorkerService {
  private apiUrl = `${environment.apiBaseUrl}/authentication`;
  private profileUrl = `${environment.apiBaseUrl}/profiles`;
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) {}

  addUser(userData: any): Observable<any> {
    const userWithRole = {
      username: userData.email,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      birthDate: userData.birthDate,
      phoneNumber: userData.phoneNumber,
      roles: ['ROLE_WORKER'] // ✅ CAMBIADO
    };
    return this.http.post<any>(`${this.apiUrl}/sign-up`, userWithRole);
  }



  setCurrentUserId(id: number) {
    this.currentUserId = id;
  }

  addImageProfile(profileData: any): Observable<any> {
    return this.http.post<any>(this.profileUrl, profileData);
  }

  login(email: string, password: string): Observable<any> {
    // Intentar varias combinaciones de endpoint y payload para encontrar la que funcione en producción
    const attempts = [
      { url: `${this.apiUrl}/sign-in`, payload: { username: email, email, password } },
      { url: `${this.apiUrl}/sign-in`, payload: { email, password } },
      { url: `${this.apiUrl}/login`, payload: { username: email, email, password } },
      { url: `${this.apiUrl}/login`, payload: { email, password } },
      { url: `${environment.apiBaseUrl}/auth/sign-in`, payload: { email, password } },
      { url: `${environment.apiBaseUrl}/auth/login`, payload: { email, password } }
    ];

    console.log('[RegisterWorkerService] login attempts count:', attempts.length);

    const trySequence = async () => {
      let lastError: any = null;
      for (const attempt of attempts) {
        try {
          console.log('[RegisterWorkerService] trying login', attempt.url, attempt.payload.username ? { username: attempt.payload.username, password: '***' } : { email: attempt.payload.email, password: '***' });
          const res = await lastValueFrom(this.http.post<any>(attempt.url, attempt.payload));
          console.debug('[RegisterWorkerService] login success from', attempt.url, res);
          // Normalizar token
          const token = res?.token || res?.accessToken || res?.data?.token || res?.result?.token;
          if (token && !res.token) res.token = token;
          return res;
        } catch (err: any) {
          lastError = err;
          // Manejo seguro de error: status y message pueden no existir
          const status = err?.status ?? (err?.error?.status ?? null);
          const message = err?.message ?? (err?.error?.message ?? JSON.stringify(err));
          console.warn('[RegisterWorkerService] attempt failed for', attempt.url, status, message);
          // Si el servidor responde con 500 sin body, seguir a siguiente intento
          continue;
        }
      }
      // Ningún intento tuvo éxito
      throw lastError ?? new Error('No login attempt succeeded');
    };

    return from(trySequence());
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('workerId');
    this.currentUserId = null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
