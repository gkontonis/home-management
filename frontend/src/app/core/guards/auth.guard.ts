import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard function that checks if the user is authenticated before allowing route activation.
 * If the user is not authenticated, redirects to the login page and prevents route activation.
 *
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns `true` if the user is authenticated; otherwise, navigates to the login page and returns `false`.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
