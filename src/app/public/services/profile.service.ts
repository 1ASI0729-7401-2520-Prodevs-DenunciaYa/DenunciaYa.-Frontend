// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {



  private profileUrl = 'http://localhost:8080/api/v1/profiles';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<any>(this.profileUrl, { headers });
  }
}
