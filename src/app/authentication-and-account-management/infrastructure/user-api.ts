import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { environment } from '../../../environments/environment';

/**
 * @class UserApi
 * @summary Handles API interactions related to user management, including fetching users, login, registration, and password updates.
 * @constructor @param {HttpClient} http - The HTTP client for making API requests.
 * @method getAll - Fetches all users of a specified role.
 * @method login - Authenticates a user with email and password for a specified role.
 * @method register - Registers a new user for a specified role.
 * @method updatePassword - Updates the password of an existing user for a specified role.
 */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}


  getAll(role: 'citizen' | 'authority' | 'responsibles'): Observable<User[]> {
    const url = `${this.baseUrl}/${role}`;
    return this.http.get<User[]>(url);
  }


  login(role: 'citizen' | 'authority' | 'responsibles', email: string, password: string): Observable<User | null> {
    const url = `${this.baseUrl}/${role}?email=${email}&password=${password}`;
    return this.http.get<User[]>(url).pipe(
      map(users => (users.length ? users[0] : null))
    );
  }


  register(role: 'citizen' | 'authority' | 'responsibles', user: User): Observable<User> {
    const url = `${this.baseUrl}/${role}`;
    return this.http.post<User>(url, user);
  }


  updatePassword(role: 'citizen' | 'authority' | 'responsibles', userId: number, updatedUser: User): Observable<User> {
    const url = `${this.baseUrl}/${role}/${userId}`;
    return this.http.put<User>(url, updatedUser);
  }
}
