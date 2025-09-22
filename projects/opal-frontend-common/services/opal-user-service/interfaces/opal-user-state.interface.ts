import { IOpalUserBusinessUnitUser } from './opal-user-business-unit-user.interface';

export interface IOpalUserState {
  user_id: number;
  username: string;
  name: string;
  status: string | null;
  version: number | null;
  business_unit_users: IOpalUserBusinessUnitUser[];
}
