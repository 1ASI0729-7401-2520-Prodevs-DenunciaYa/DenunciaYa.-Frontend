import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../authentication-and-account-management/infrastructure/auth.service';

/**
 * @class RoleGuard
 * @implements CanActivate
 * @summary Guard for user role-based access control
 *
 * @classdesc
 * This guard verifies if the current user has the necessary roles
 * to access a specific route. If the user doesn't have the required role,
 * they are redirected to the home page.
 *
 * @method canActivate - Verifies if the user can activate the route
 * @param {ActivatedRouteSnapshot} route - Current route snapshot
 * @returns {boolean} - True if user has access, false if not
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  /**
   * @constructor
   * @param {Router} router - Router service for navigation
   * @param {AuthService} authService - Authentication service to get user data
   */
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * @method canActivate
   * @summary Determines if the user can access the route
   * @description
   * Gets the current user and required roles for the route.
   * If the user doesn't exist or doesn't have the required role, redirects to home.
   *
   * @param {ActivatedRouteSnapshot} route - Activated route snapshot
   * @returns {boolean} True if user has access, false if not
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const requiredRoles = route.data['roles'] as Array<'citizen' | 'authority' | 'responsibles'>;

    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
