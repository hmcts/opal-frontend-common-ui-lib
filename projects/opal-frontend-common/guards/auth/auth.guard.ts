import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';

/**
 * Transient router information used when a protected route has already established that the session is unauthenticated.
 *
 * This prevents the sign-in guard from repeating the same authentication request during the redirect navigation.
 */
export const UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO = 'opal-frontend-common:unauthenticated-sign-in-redirect';

export type ServerSsoRedirectTarget = 'login' | 'logout';

/** Records an SSO redirect during SSR so the hosting server can send the HTTP redirect. */
export const SERVER_SSO_REDIRECT = new InjectionToken<(target: ServerSsoRedirectTarget) => void>('serverSsoRedirect');

export const REDIRECT_TO_SSO = new InjectionToken<() => void>('redirectToSsoLogin', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    const platformId = inject(PLATFORM_ID);
    const serverRedirect = inject(SERVER_SSO_REDIRECT, { optional: true });

    return () => {
      if (isPlatformBrowser(platformId)) {
        document.location.href = SSO_ENDPOINTS.login;
      } else {
        serverRedirect?.('login');
      }
    };
  },
});

export const REDIRECT_TO_SSO_LOGOUT = new InjectionToken<() => void>('redirectToSsoLogout', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    const platformId = inject(PLATFORM_ID);
    const serverRedirect = inject(SERVER_SSO_REDIRECT, { optional: true });

    return () => {
      if (isPlatformBrowser(platformId)) {
        document.location.href = SSO_ENDPOINTS.logout;
      } else {
        serverRedirect?.('logout');
      }
    };
  },
});

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const opalUserService = inject(OpalUserService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);
  const redirectToSsoLogin = inject(REDIRECT_TO_SSO);

  const redirectToUnauthenticated = () => {
    opalUserService.clearUserStateCache();
    if (globalStore.ssoEnabled()) {
      redirectToSsoLogin();
      return false;
    }

    return new RedirectCommand(router.createUrlTree([PAGES_ROUTING_PATHS.children.signIn]), {
      info: UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO,
    });
  };

  const redirectToInternalServerError = () =>
    router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);

  return authService.checkAuthenticated().pipe(
    map((authenticated) => (authenticated ? true : redirectToUnauthenticated())),
    catchError((error: unknown) => {
      if (hasHttpStatus(error, 401)) {
        return of(redirectToUnauthenticated());
      }
      return of(redirectToInternalServerError());
    }),
  );
};

/** Returns true when an HTTP error exposes the expected numeric status. */
function hasHttpStatus(error: unknown, expectedStatus: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status === expectedStatus
  );
}
