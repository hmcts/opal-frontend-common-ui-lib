import { inject, InjectionToken } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanActivateFn,
  createUrlTreeFromSnapshot,
  type MaybeAsync,
  Router,
} from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { BusinessUnitIdResolver } from './interfaces/business-unit-id-resolver.interface';

/**
 * Injection token used by consuming applications to provide a resolver that can
 * determine the business unit for the current route context.
 */
export const BUSINESS_UNIT_ID_RESOLVER = new InjectionToken<BusinessUnitIdResolver>('BUSINESS_UNIT_ID_RESOLVER');

/**
 * Resolves values that may be synchronous, promise-based, or observable-based into a promise.
 *
 * @param value - The value to resolve.
 * @returns A promise containing the resolved value.
 */
const resolveMaybeAsync = async <T>(value: MaybeAsync<T>): Promise<T> =>
  isObservable(value) ? firstValueFrom(value) : Promise.resolve(value);

/**
 * Reads and normalizes the permission ids declared on route data.
 *
 * @param route - The route whose permission metadata should be inspected.
 * @returns A filtered array of numeric permission ids.
 */
const getRoutePermissionIds = (route: ActivatedRouteSnapshot): number[] => {
  const routePermissionIds = route.data?.['routePermissionId'];

  if (Array.isArray(routePermissionIds)) {
    return routePermissionIds.filter((permissionId): permissionId is number => typeof permissionId === 'number');
  }

  if (typeof routePermissionIds === 'number') {
    return [routePermissionIds];
  }

  return [];
};

/**
 * Creates the access denied redirect for permission failures.
 *
 * Absolute paths are resolved from the app root. Relative paths are resolved
 * from the guarded route's parent so account-flow denied pages stay under the
 * current account route.
 *
 * @param route - The route being protected by the guard.
 * @param router - The router used to create the redirect URL tree.
 * @param accessDeniedPath - The configured access denied path.
 * @returns A URL tree pointing to the denied route.
 */
const toAccessDeniedUrlTree = (route: ActivatedRouteSnapshot, router: Router, accessDeniedPath: string) => {
  if (accessDeniedPath.startsWith('/')) {
    return router.createUrlTree([accessDeniedPath]);
  }

  return createUrlTreeFromSnapshot(route.parent ?? route, [accessDeniedPath]);
};

/**
 * Guard that checks route permissions against the business unit resolved for the
 * current route instead of against the user's global permission set.
 *
 * If the route does not declare any permission ids, the guard allows access.
 * Otherwise it loads the logged-in user state, resolves the route business unit,
 * and confirms that at least one declared permission exists within that business unit.
 *
 * @param route - The route being activated.
 * @returns `true` when access is allowed, otherwise a redirect to access denied.
 */
export const businessUnitRoutePermissionsGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const routePermissionIds = getRoutePermissionIds(route);

  if (!routePermissionIds.length) {
    return true;
  }

  const permissionService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const businessUnitResolver = inject(BUSINESS_UNIT_ID_RESOLVER);
  const router = inject(Router);
  const accessDeniedPath = route.data?.['accessDeniedPath'] ?? `/${PAGES_ROUTING_PATHS.children.accessDenied}`;

  try {
    const userState = await firstValueFrom(opalUserService.getLoggedInUserState());
    const businessUnitUsers = userState?.business_unit_users ?? [];

    if (!businessUnitUsers.length) {
      return toAccessDeniedUrlTree(route, router, `${accessDeniedPath}`);
    }

    const businessUnitId = await resolveMaybeAsync(businessUnitResolver.resolveBusinessUnitId(route));

    if (typeof businessUnitId !== 'number' || !Number.isFinite(businessUnitId) || businessUnitId <= 0) {
      return toAccessDeniedUrlTree(route, router, `${accessDeniedPath}`);
    }

    const hasAccess = routePermissionIds.some((permissionId) =>
      permissionService.hasBusinessUnitPermissionAccess(permissionId, businessUnitId, businessUnitUsers),
    );

    return hasAccess ? true : toAccessDeniedUrlTree(route, router, `${accessDeniedPath}`);
  } catch {
    return toAccessDeniedUrlTree(route, router, `${accessDeniedPath}`);
  }
};
