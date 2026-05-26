import { IOpalUserBusinessUnitUser } from './opal-user-business-unit-user.interface';
import type { OpalUserStateStatus } from './opal-user-state-status.type';

export interface IOpalUserState {
  user_id: number;
  username: string;
  name: string;
  status: OpalUserStateStatus | null;
  version: number | null;
  business_unit_users: IOpalUserBusinessUnitUser[];
}
