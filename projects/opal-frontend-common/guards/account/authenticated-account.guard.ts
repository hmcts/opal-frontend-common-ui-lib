import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { REDIRECT_TO_SSO } from '@hmcts/opal-frontend-common/guards/auth';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';

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
 * Checks authentication before retrieving the logged-in user's account state.
 *
 * The checks must be composed in a single guard: placing `authGuard` and
 * `accountGuard` in a route guard array allows Angular to subscribe to both
 * asynchronous checks at once.
 */
export const authenticatedAccountGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const opalUserService = inject(OpalUserService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);
  const redirectToSsoLogin = inject(REDIRECT_TO_SSO);

  const redirectToUnauthenticated = () => {
    if (globalStore.ssoEnabled()) {
      redirectToSsoLogin();
      return false;
    }

    return router.createUrlTree([PAGES_ROUTING_PATHS.children.signIn]);
  };

  const redirectToAccountCreated = () => router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);
  const redirectToInternalServerError = () =>
    router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);

  return authService.checkAuthenticated().pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
        return of(redirectToUnauthenticated());
      }

      return opalUserService.getLoggedInUserState().pipe(
        map((userState) => {
          if (userState?.status === 'active') {
            return true;
          }

          return redirectToAccountCreated();
        }),
        catchError((error: unknown) => {
          if (hasHttpStatus(error, 401)) {
            opalUserService.clearUserStateCache();
            return of(redirectToUnauthenticated());
          }

          return of(redirectToInternalServerError());
        }),
      );
    }),
    catchError((error: unknown) => {
      if (hasHttpStatus(error, 401)) {
        return of(redirectToUnauthenticated());
      }

      return of(redirectToInternalServerError());
    }),
  );
};
