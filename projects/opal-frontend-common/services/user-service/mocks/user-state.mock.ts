import { IUserState } from '@hmcts/opal-frontend-common/services/user-service/interfaces';
import { USER_BUSINESS_UNIT_USER_MOCK } from './user-business-unit-user.mock';

export const USER_STATE_MOCK: IUserState = {
  user_id: 50000000,
  username: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
  status: 'active',
  version: 1,
  business_unit_users: USER_BUSINESS_UNIT_USER_MOCK,
};
