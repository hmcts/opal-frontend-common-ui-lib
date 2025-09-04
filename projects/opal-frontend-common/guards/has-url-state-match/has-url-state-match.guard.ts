import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

/**
 * Creates a route guard that checks whether the current URL state matches specific conditions.
 *
 * This function returns a CanActivate guard function that performs the following steps:
 * 1. Retrieves the current state using the provided getState function.
 * 2. Checks the route using the checkRoute function.
 * 3. Evaluates the state and route using the checkCondition function.
 * 4. If the route or condition check fails, it redirects to a URL created by the getNavigationPath function
 *    while preserving query parameters and the URL fragment.
 *
 * @typeParam T The type of the state returned by getState.
 *
 * @param getState - A function that returns the current state.
 * @param hasRouteParams - A function that receives an ActivatedRouteSnapshot and returns a boolean indicating whether the route meets certain criteria.
 * @param checkCondition - A function that evaluates whether the current state satisfies the necessary condition based on the ActivatedRouteSnapshot.
 * @param getNavigationPath - A function that receives an ActivatedRouteSnapshot and returns the navigation path as a string for redirection.
 *
 * @returns A function implementing the CanActivate guard that returns `true` if the route and state meet the required conditions,
 *          or a UrlTree for redirection if they do not.
 */
export function hasUrlStateMatchGuard<T>(
  getState: () => T,
  hasRouteParams: (route: ActivatedRouteSnapshot) => boolean,
  checkCondition: (state: T, route: ActivatedRouteSnapshot) => boolean,
  getNavigationPath: (route: ActivatedRouteSnapshot) => string,
): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const state = getState();
    const { queryParams, fragment } = route;

    const createRedirectUrlTree = () => {
      const hasQueryParams = Object.keys(queryParams || {}).length > 0;
      return router.createUrlTree([getNavigationPath(route)], {
        queryParams: hasQueryParams ? queryParams : undefined,
        fragment: fragment ?? undefined,
      });
    };

    if (!hasRouteParams(route)) {
      return createRedirectUrlTree();
    }

    if (!checkCondition(state, route)) {
      return createRedirectUrlTree();
    }

    return true;
  };
}
