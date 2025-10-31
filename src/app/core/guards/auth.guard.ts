import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../authentication-and-account-management/infrastructure/auth.service';

/**
 * @class AuthGuard
 * @summary Guard to protect routes based on authentication status and user roles.
 * @implements CanActivate
 * @constructor
 * @param {Router} router - Angular Router for navigation.
 * @param {AuthService} authService - Service for authentication and user information.
 * @method canActivate - Determines if a route can be activated based on authentication and role.
 * @param {ActivatedRouteSnapshot} route - The activated route snapshot.
 * @return {boolean} True if the route can be activated, false otherwise.
 * @method redirectBasedOnRole - Redirects users to role-specific complaint detail pages.
 * @method getComplaintId - Extracts the complaint ID from the current URL.
 * @return {string} The complaint ID.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    const currentPath = route.routeConfig?.path;

    if (currentPath === 'complaint-detail/:id') {
      this.redirectBasedOnRole();
      return false;
    }

    return true;
  }

  private redirectBasedOnRole(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      switch (currentUser.role) {
        case 'authority':
        case 'responsibles':
          this.router.navigate(['/complaint-detail-authority', this.getComplaintId()]);
          break;
        case 'citizen':
          this.router.navigate(['/complaint-detail-citizen', this.getComplaintId()]);
          break;
        default:
          this.router.navigate(['/home']);
      }
    }
  }

  private getComplaintId(): string {
    const currentUrl = this.router.url;
    const idMatch = currentUrl.match(/complaint-detail\/(.+)/);
    return idMatch ? idMatch[1] : '';
  }
}
