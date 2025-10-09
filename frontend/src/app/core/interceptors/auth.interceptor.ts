import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * An HTTP interceptor function that attaches a JWT bearer token to outgoing HTTP requests,
 * except for requests targeting authentication endpoints (URLs containing '/auth/').
 * The token is retrieved from the injected AuthService.
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next handler in the HTTP request chain.
 * @returns The handled HTTP request, potentially with an Authorization header set.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && !req.url.includes('/auth/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
