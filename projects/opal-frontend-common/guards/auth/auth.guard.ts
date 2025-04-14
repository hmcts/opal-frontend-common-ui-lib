import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 * @returns An Observable that emits a boolean value indicating whether the user is authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);

  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      if (globalStore.ssoEnabled()) {
        window.location.href = SSO_ENDPOINTS.login;
      } else {
        router.navigate([PAGES_ROUTING_PATHS.children.signIn]);
      }
      return of(false);
    }),
  );
};
