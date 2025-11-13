import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard function that checks if the user has admin role before allowing route activation.
 * If the user is not an admin, redirects to the dashboard page and prevents route activation.
 *
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns `true` if the user is an admin; otherwise, navigates to the dashboard and returns `false`.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // User is authenticated but not admin - redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};
