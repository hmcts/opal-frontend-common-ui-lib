import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO } from '@hmcts/opal-frontend-common/guards/auth';

function hasHttpStatus(error: unknown, expectedStatus: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status === expectedStatus
  );
}

/**
 * A guard that checks if the user is signed in.
 * If the user is signed in, it redirects to the default route.
 * If the user is not signed in, it allows access to the route. Authentication service failures redirect to an error page.
 * @returns A guard result that redirects signed-in users or allows unauthenticated users to access the route.
 */
export const signedInGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  if (router.currentNavigation()?.extras.info === UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO) {
    return true;
  }

  return authService.checkAuthenticated().pipe(
    map((authenticated) => {
      return authenticated ? router.createUrlTree(['/']) : true;
    }),
    catchError((error: unknown) => {
      if (hasHttpStatus(error, 401)) {
        return of(true);
      }

      return of(router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]));
    }),
  );
};
