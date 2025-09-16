import { IUserBusinessUnitUser } from './user-business-unit-user.interface';

export interface IUserState {
  user_id: number;
  username: string;
  name: string;
  status: string | null;
  version: number | null;
  business_unit_users: IUserBusinessUnitUser[];
}
