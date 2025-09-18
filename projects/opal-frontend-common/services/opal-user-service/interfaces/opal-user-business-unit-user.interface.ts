import { IOpalUserPermissions } from './opal-user-permissions.interface';

export interface IOpalUserBusinessUnitUser {
  business_unit_user_id: string;
  business_unit_id: number;
  permissions: IOpalUserPermissions[];
}
