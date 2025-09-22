import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_BUSINESS_UNIT_USER_MOCK } from './opal-user-business-unit-user.mock';

export const OPAL_USER_STATE_MOCK: IOpalUserState = {
  user_id: 50000000,
  username: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
  status: 'active',
  version: 1,
  business_unit_users: OPAL_USER_BUSINESS_UNIT_USER_MOCK,
};
