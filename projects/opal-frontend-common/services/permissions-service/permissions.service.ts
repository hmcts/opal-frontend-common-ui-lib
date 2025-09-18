import { Injectable } from '@angular/core';
import {
  IOpalUserState,
  IOpalUserBusinessUnitUser,
} from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private storedUniquePermissionIds: number[] = [];

  /**
   * Retrieves the unique permission IDs associated with the user.
   * If the unique permission IDs have not been stored yet, it calculates them based on the user's roles and permissions.
   * @returns An array of unique permission IDs.
   */
  public getUniquePermissions(userState: IOpalUserState | null): number[] {
    const roles = userState ? userState['business_unit_users'] : null;

    if (!this.storedUniquePermissionIds.length && roles) {
      const permissionIds = roles.flatMap((role) => {
        return role.permissions.map(({ permission_id: permissionId }) => permissionId);
      });

      this.storedUniquePermissionIds = [...new Set(permissionIds)];
    }

    return this.storedUniquePermissionIds;
  }

  /**
   * Determines whether the user has access to a specific permission based on their roles.
   *
   * This method short-circuits and returns as soon as a matching permission is found for efficiency.
   *
   * @param permissionId - The ID of the permission to check for access.
   * @param roles - An array of user roles, each containing a list of permissions.
   * @returns `true` if the user has the specified permission in any of their roles,
   *          or if no roles are provided; otherwise, returns `false`.
   */
  public hasPermissionAccess(permissionId: number, roles: IOpalUserBusinessUnitUser[]): boolean {
    if (roles?.length) {
      return roles.some((role) => role.permissions.some((permission) => permission.permission_id === permissionId));
    }
    // if we don't have any roles, we can't have any permissions
    return true;
  }

  /**
   * Checks if the user has access to a specific permission within a given business unit.
   *
   * This method short-circuits and returns as soon as a matching permission is found for efficiency.
   *
   * @param permissionId - The ID of the permission to check.
   * @param businessUnitId - The ID of the business unit to check against.
   * @param roles - An array of user roles, each containing permissions and associated business unit IDs.
   * @returns `true` if the user has the specified permission for the business unit, or if no roles are provided; otherwise, `false`.
   */
  public hasBusinessUnitPermissionAccess(
    permissionId: number,
    businessUnitId: number,
    roles: IOpalUserBusinessUnitUser[],
  ): boolean {
    if (roles?.length) {
      return roles.some(
        (role) =>
          role.business_unit_id === businessUnitId &&
          role.permissions.some((permission) => permission.permission_id === permissionId),
      );
    }
    // if we don't have any roles, we can't have any permissions
    return true;
  }
}
