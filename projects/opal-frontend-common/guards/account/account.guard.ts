import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';

/**
 * A route guard that determines whether a user can activate a route based on their account status.
 * 
 * This guard uses the `OpalUserService` to fetch the logged-in user's state and decides the navigation
 * behavior based on the user's account status:
 * - If the user's status is `active`, the route is activated.
 * - If the user's status is `created`, the user is redirected to the "Account Created" page.
 * - For any other status or in case of an error, the user is redirected to the "Account Created" page.
 * 
 * @returns An observable that emits either `true` to activate the route or a `UrlTree` to redirect the user.
 */
export const accountGuard: CanActivateFn = () => {
  const opalUserService = inject(OpalUserService);
  const router = inject(Router);

  const redirectToAccountCreated = () => router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);

  return opalUserService.getLoggedInUserState().pipe(
    map((userState) => {
      if (userState?.status === 'active') {
        return true;
      }

      if (userState?.status === 'created') {
        return redirectToAccountCreated();
      }

      return redirectToAccountCreated();
    }),
    catchError(() => {
      return of(redirectToAccountCreated());
    }),
  );
};
