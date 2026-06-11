import { inject, InjectionToken } from '@angular/core';
import { type ActivatedRouteSnapshot, type CanActivateFn, type MaybeAsync, Router } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { BusinessUnitIdResolver } from './interfaces/business-unit-id-resolver.interface';

export const BUSINESS_UNIT_ID_RESOLVER = new InjectionToken<BusinessUnitIdResolver>('BUSINESS_UNIT_ID_RESOLVER');

const resolveMaybeAsync = async <T>(value: MaybeAsync<T>): Promise<T> =>
  isObservable(value) ? firstValueFrom(value) : Promise.resolve(value);

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

const toAccessDeniedUrlTree = (router: Router, accessDeniedPath: string) => router.createUrlTree([accessDeniedPath]);

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
      return toAccessDeniedUrlTree(router, `${accessDeniedPath}`);
    }

    const businessUnitId = await resolveMaybeAsync(businessUnitResolver.resolveBusinessUnitId(route));

    if (typeof businessUnitId !== 'number' || !Number.isFinite(businessUnitId) || businessUnitId <= 0) {
      return toAccessDeniedUrlTree(router, `${accessDeniedPath}`);
    }

    const hasAccess = routePermissionIds.some((permissionId) =>
      permissionService.hasBusinessUnitPermissionAccess(permissionId, businessUnitId, businessUnitUsers),
    );

    return hasAccess ? true : toAccessDeniedUrlTree(router, `${accessDeniedPath}`);
  } catch {
    return toAccessDeniedUrlTree(router, `${accessDeniedPath}`);
  }
};
