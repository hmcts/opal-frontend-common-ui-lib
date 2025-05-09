import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';

/**
 * A guard that checks if the user is signed in.
 * If the user is signed in, it redirects to the default route.
 * If the user is not signed in, it allows access to the route.
 * @returns An Observable<boolean> indicating whether the user is signed in or not.
 */
export const signedInGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthenticated().pipe(
    map(() => {
      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
