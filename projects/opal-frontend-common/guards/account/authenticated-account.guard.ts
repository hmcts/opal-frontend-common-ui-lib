import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  REDIRECT_TO_SSO,
  REDIRECT_TO_SSO_LOGOUT,
  UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO,
} from '@hmcts/opal-frontend-common/guards/auth';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { NavigationAuthenticationService } from './navigation-authentication.service';

/**
 * Determines whether an unknown HTTP error has the specified response status.
 *
 * @param error - The value emitted by the failed HTTP observable.
 * @param expectedStatus - The HTTP status code to match.
 * @returns True when the error exposes a numeric status matching {@link expectedStatus}.
 */
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
  const navigationAuthenticationService = inject(NavigationAuthenticationService);
  const opalUserService = inject(OpalUserService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);
  const redirectToSsoLogin = inject(REDIRECT_TO_SSO);
  const redirectToSsoLogout = inject(REDIRECT_TO_SSO_LOGOUT);

  const redirectToLogin = () => {
    if (globalStore.ssoEnabled()) {
      redirectToSsoLogin();
      return false;
    }

    return new RedirectCommand(router.createUrlTree([PAGES_ROUTING_PATHS.children.signIn]), {
      info: UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO,
    });
  };

  const redirectToUnauthenticated = () => {
    opalUserService.clearUserStateCache();
    return redirectToLogin();
  };

  const redirectToAccountCreated = () => router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);
  const redirectToInternalServerError = () =>
    router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);

  const redirectToSessionMismatch = () => {
    if (globalStore.ssoEnabled()) {
      opalUserService.clearUserStateCache();
      redirectToSsoLogout();
      return of(false);
    }

    return authService.logout().pipe(
      map(() => redirectToLogin()),
      catchError(() => of(redirectToInternalServerError())),
    );
  };

  return navigationAuthenticationService.checkAuthenticated().pipe(
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
            return redirectToSessionMismatch();
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
