import { IUserPermissions } from './user-permissions.interface';

export interface IUserBusinessUnitUser {
  business_unit_user_id: string;
  business_unit_id: number;
  permissions: IUserPermissions[];
}
