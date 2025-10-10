import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los usuarios de un rol (citizen, authority, etc.)
   */
  getAll(role: 'citizen' | 'authority' | 'responsibles'): Observable<User[]> {
    const url = `${this.baseUrl}/${role}`;
    return this.http.get<User[]>(url);
  }

  /**
   * Autentica un usuario por email y password dentro de su colección (rol)
   */
  login(role: 'citizen' | 'authority' | 'responsibles', email: string, password: string): Observable<User | null> {
    const url = `${this.baseUrl}/${role}?email=${email}&password=${password}`;
    return this.http.get<User[]>(url).pipe(
      map(users => (users.length ? users[0] : null))
    );
  }

  /**
   * Registra un nuevo usuario dentro de su colección (rol)
   */
  register(role: 'citizen' | 'authority' | 'responsibles', user: User): Observable<User> {
    const url = `${this.baseUrl}/${role}`;
    return this.http.post<User>(url, user);
  }

  /**
   * Actualiza la contraseña de un usuario
   */
  updatePassword(role: 'citizen' | 'authority' | 'responsibles', userId: number, updatedUser: User): Observable<User> {
    const url = `${this.baseUrl}/${role}/${userId}`;
    return this.http.put<User>(url, updatedUser);
  }
}
