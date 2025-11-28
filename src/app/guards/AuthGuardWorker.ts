import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardWorker implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('onid'); // o el ID del worker, si lo guardas como "wkid"

    if (token && userId) {
      return true;
    } else {
      return this.router.createUrlTree(['/pages/login-worker']);
    }
  }
}
