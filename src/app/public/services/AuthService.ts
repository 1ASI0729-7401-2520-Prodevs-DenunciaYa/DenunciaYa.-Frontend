import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  logout() {
    // Limpiar TODO el almacenamiento local y de sesión para evitar residuos de sesión
    try {
      localStorage.clear();
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('onid');
    }
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }

    // Borrar cookies comunes (JSESSIONID, token, etc.) para evitar auth persistente en el backend
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (!name) continue;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    } catch (e) {
      // ignore
    }

    // Disparar evento para que stores locales puedan limpiar su estado
    try { window.dispatchEvent(new CustomEvent('app:logout')); } catch (e) { /* ignore */ }

    // Navegar al login (sin recargar la página) y reemplazar la URL para evitar "back" inmediato
    this.router.navigateByUrl('/pages/login-owner', { replaceUrl: true });
  }

}
