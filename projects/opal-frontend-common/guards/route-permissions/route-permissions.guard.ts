import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { UserService } from '@hmcts/opal-frontend-common/services/user-service';

export const routePermissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionsService);
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUserState().pipe(
    map((resp) => {
      const routePermissionIds: number[] = route.data['routePermissionId'] ?? []; // Ensure it's an array
      const accessDeniedPath = route.data['accessDeniedPath'] ?? `/${PAGES_ROUTING_PATHS.children.accessDenied}`; // Default to the provided path

      // Get the unique permission IDs for the user
      const uniquePermissionIds = permissionService.getUniquePermissions(resp);

      // If no permissions are required for the route, or the user has at least one matching permission, allow access
      if (routePermissionIds.length === 0 || uniquePermissionIds.some((id) => routePermissionIds.includes(id))) {
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
