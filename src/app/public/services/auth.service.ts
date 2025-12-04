import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  readonly token$ = this.tokenSubject.asObservable();

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
      this.tokenSubject.next(token);
    } else {
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
    }
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

