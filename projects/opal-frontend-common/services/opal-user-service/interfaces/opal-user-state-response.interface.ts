import type { OpalUserStateResponseStatus } from './opal-user-state-response-status.type';
import { IOpalUserBusinessUnitUser } from './opal-user-business-unit-user.interface';

interface IOpalUserStateResponseDomain {
  business_unit_users: IOpalUserBusinessUnitUser[];
}

export interface IOpalUserStateResponse {
  user_id: number;
  username: string;
  name: string;
  status: OpalUserStateResponseStatus | null;
  version: number | null;
  cache_name: string | null;
  domains: Record<string, IOpalUserStateResponseDomain | undefined>;
}
