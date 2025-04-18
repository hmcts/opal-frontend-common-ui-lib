import { Injectable } from '@angular/core';
import {
  ISessionUserState,
  ISessionUserStatePermission,
  ISessionUserStateRole,
} from '@hmcts/opal-frontend-common/services/session-service/interfaces';

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
  public getUniquePermissions(userState: ISessionUserState | null): number[] {
    const roles = userState ? userState['business_unit_user'] : null;

    if (!this.storedUniquePermissionIds.length && roles) {
      const permissionIds = roles.flatMap((role) => {
        return role.permissions.map(({ permission_id: permissionId }) => permissionId);
      });

      this.storedUniquePermissionIds = [...new Set(permissionIds)];
    }

    return this.storedUniquePermissionIds;
  }

  public hasPermissionAccess(permissionId: number, businessUnitId: number, roles: ISessionUserStateRole[]): boolean {
    if (roles?.length) {
      // First we need to find the matching role
      const role = roles?.find((role) => role.business_unit_id === businessUnitId);

      // Then we need to find the matching permission
      const hasPermission = !!role?.permissions.find(
        (permission: ISessionUserStatePermission) => permission.permission_id === permissionId,
      );

      return hasPermission;
    }
    // if we don't have any roles, we can't have any permissions
    return true;
  }
}
