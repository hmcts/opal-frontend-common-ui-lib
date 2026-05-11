import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { UserStateService } from '@hmcts/opal-frontend-common/services/user-state-service';

/**
 * A route guard that determines whether a user can activate a route based on their account status.
 *
 * This guard uses the `UserStateService` to fetch the logged-in user's state and decides the navigation
 * behavior based on the user's account status:
 * - If the user's status is `ACTIVE`, the route is activated.
 * - For any other status or in case of an error, the user is redirected to the "Account Created" page.
 *
 * @returns An observable that emits either `true` to activate the route or a `UrlTree` to redirect the user.
 */
export const accountGuard: CanActivateFn = () => {
  const userStateService = inject(UserStateService);
  const router = inject(Router);

  const redirectToAccountCreated = () => router.createUrlTree([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);

  return userStateService.getUserState().pipe(
    map((userState) => {
      if (userState?.status === 'ACTIVE') {
        return true;
      }

      return redirectToAccountCreated();
    }),
    catchError(() => {
      return of(redirectToAccountCreated());
    }),
  );
};
