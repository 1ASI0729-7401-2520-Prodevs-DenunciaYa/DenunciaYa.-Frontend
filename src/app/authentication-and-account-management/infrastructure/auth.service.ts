import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * @interface User
 * @summary Represents a user in the authentication system.
 * @property {number} id - The unique identifier of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} [phone] - The phone number of the user (optional).
 * @property {'citizen' | 'authority' | 'responsibles'} role - The role of the user.
 * @property {string} plan - The subscription plan of the user.
 * @property {string} paymentStatus - The payment status of the user.
 * @property {string} [password] - The password of the user (optional).
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'authority' | 'responsibles';
  plan: string;
  paymentStatus: string;
  password?: string;
}

/**
 * @Service AuthService
 * @summary Service for handling user authentication and session management.
 * @constructor @param {HttpClient} http - The HTTP client for making API requests.
 * @method login - Authenticates a user with email, password, and role.
 * @method setCurrentUser - Sets the current authenticated user.
 * @method getCurrentUser - Retrieves the current authenticated user.
 * @method logout - Logs out the current user and clears session data.
 * @method isAuthenticated - Checks if a user is currently authenticated.
 * @method updateUser - Updates the current user's information.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  async login(email: string, password: string, role: 'citizen' | 'authority'  ): Promise<User | null> {
    try {
      const url = `${this.baseUrl}/${role}?email=${email}&password=${password}`;
      const response = await firstValueFrom(this.http.get<any[]>(url));
      const user = response.length > 0 ? response[0] : null;

      if (user) {
        user.role = role;
        this.setCurrentUser(user);
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  updateUser(updatedUser: User): void {
    this.setCurrentUser(updatedUser);
  }

}
