import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://denunciaya-fakeapi.onrender.com';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string, role: string): Promise<any | null> {
    const url = `${this.baseUrl}/${role}?email=${email}&password=${password}`;
    const response = await firstValueFrom(this.http.get<any[]>(url));
    return response.length > 0 ? response[0] : null;
  }
}
