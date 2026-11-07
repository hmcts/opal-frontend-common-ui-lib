import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';

export const routePermissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  // Legacy metadata must not make an unmigrated protected route unrestricted.
  if ('routePermissionId' in (route.data ?? {})) {
    return false;
  }

  const permissionService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const router = inject(Router);

  return opalUserService.getLoggedInUserState().pipe(
    map((resp) => {
      const permissionMetadata: unknown = route.data['routePermissionCodes'] ?? [];
      // Array membership compares complete codes; string.includes would match substrings.
      const routePermissionCodes: unknown[] = Array.isArray(permissionMetadata)
        ? permissionMetadata
        : [permissionMetadata];
      const accessDeniedPath = route.data['accessDeniedPath'] ?? `/${PAGES_ROUTING_PATHS.children.accessDenied}`; // Default to the provided path

      // Get the unique permission codes for the user
      const uniquePermissionCodes = permissionService.getUniquePermissions(resp);

      // If no permissions are required for the route, or the user has at least one matching permission, allow access
      if (
        routePermissionCodes.length === 0 ||
        routePermissionCodes.some((code) => typeof code === 'string' && uniquePermissionCodes.includes(code))
      ) {
        return true;
      }

      // Redirect the user to the access denied page if they lack all required permissions
      return router.createUrlTree([`${accessDeniedPath}`]);
    }),
    catchError(() => {
      return of(false);
    }),
  );
};
