import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterWorkerService {
  private apiUrl = 'http://localhost:8080/api/v1/authentication';
  private profileUrl = 'http://localhost:8080/api/v1/profiles';
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
    return this.http.post(`${this.apiUrl}/sign-in`, {
      username: email,
      password: password
    });
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
