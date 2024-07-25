import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['role'];
    const currentRole = this.authService.getRole() ?? '';

    if (this.authService.isAuthenticated() && this.hasRole(expectedRoles, currentRole)) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

  private hasRole(expectedRoles: string[] | string, currentRole: string): boolean {
    if (Array.isArray(expectedRoles)) {
      return expectedRoles.includes(currentRole);
    }
    return expectedRoles === currentRole;
  }
}
