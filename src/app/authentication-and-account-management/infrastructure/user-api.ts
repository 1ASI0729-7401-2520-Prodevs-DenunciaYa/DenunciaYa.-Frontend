import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { User } from '../domain/model/user.entity';

/** * UserApi handles HTTP operations related to User entities.
 * It provides methods to fetch, authenticate, register, and update users.
 * @class UserApi
 * @summary Handles HTTP operations for User entities.
 * @method getAll - Fetches all users from the API.
 * @method login - Authenticates a user by email and password.
 * @method register - Registers a new user.
 * @method updatePassword - Updates a user's password.
 * @author Omar Harold Rivera Ticllacuri
 */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly baseUrl = 'http://localhost:3000/users'; // tu json-server

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`)
      .pipe(
        map(users => users.length ? users[0] : null)
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }
  updatePassword(userId: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, updatedUser);
  }

}
