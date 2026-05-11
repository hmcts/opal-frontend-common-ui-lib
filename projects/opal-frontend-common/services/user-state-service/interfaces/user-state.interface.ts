export type IUserStateStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED';

export interface IUserStatePermission {
  permission_id: number;
  permission_name: string;
}

export interface IUserStateBusinessUnitUser {
  business_unit_user_id: string;
  business_unit_id: number;
  permissions: IUserStatePermission[];
}

export interface IUserStateDomain {
  business_unit_users: IUserStateBusinessUnitUser[];
}

export interface IUserStateDomains {
  fines?: IUserStateDomain;
  [domain: string]: IUserStateDomain | undefined;
}

export interface IUserState {
  user_id: number;
  username: string;
  name: string;
  status: IUserStateStatus | null;
  version: number | null;
  cache_name: string | null;
  domains: IUserStateDomains;
}
