import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear(); // o removeItem('token'), etc.
    this.router.navigate(['/pages/login-owner']); // o una ruta neutral como /login
  }

}
