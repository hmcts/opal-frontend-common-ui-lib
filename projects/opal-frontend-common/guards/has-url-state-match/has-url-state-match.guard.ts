import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

/**
 * Factory function to create a route guard that checks URL state matching.
 *
 * The returned guard function evaluates the current route and state conditions to determine if navigation should
 * proceed or if the user should be redirected to a different path. It performs the following checks in order:
 *
 * 1. Uses the provided `checkRoute` function to determine if the current route meets specific criteria. If true,
 *    the guard returns `true`, allowing navigation.
 *
 * 2. If the above check fails, it then evaluates the state condition using the `checkCondition` function with the
 *    current state (fetched via `getState`) and the `ActivatedRouteSnapshot`. If this check passes, navigation is allowed.
 *
 * 3. If both checks fail, the guard redirects the user to a path determined by `getNavigationPath`, preserving any query
 *    parameters (if present) and the URL fragment.
 *
 * @template T - The type of the state object retrieved by `getState`.
 * @param getState - A function that returns the current state.
 * @param checkRoute - A function that checks whether the current route (via `ActivatedRouteSnapshot`) meets specific criteria.
 * @param checkCondition - A function that checks a condition based on the current state and the route snapshot.
 * @param getNavigationPath - A function that returns a navigation path string based on the current route snapshot.
 * @returns A route guard function complying with the `CanActivateFn` interface, which returns either `true` (allowing navigation)
 *          or a UrlTree (redirecting to an alternative URL).
 */
export function hasUrlStateMatchGuard<T>(
  getState: () => T,
  checkRoute: (route: ActivatedRouteSnapshot) => boolean,
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

    if (!checkRoute(route)) {
      return createRedirectUrlTree();
    }

    if (!checkCondition(state, route)) {
      return createRedirectUrlTree();
    }

    return true;
  };
}
