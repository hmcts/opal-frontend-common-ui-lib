import { CanActivateFn, Router } from '@angular/router';
import { inject, InjectionToken } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';

export const REDIRECT_TO_SSO = new InjectionToken<() => void>('redirectToSsoLogin', {
  providedIn: 'root',
  factory: () => () => {
    globalThis.location.href = SSO_ENDPOINTS.login;
  },
});

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);
  const redirectToSsoLogin = inject(REDIRECT_TO_SSO);

  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      if (globalStore.ssoEnabled()) {
        redirectToSsoLogin();
      } else {
        router.navigate([PAGES_ROUTING_PATHS.children.signIn]);
      }
      return of(false);
    }),
  );
};
