import type {
  IOpalUserStateResponse,
  OpalUserStateResponseStatus,
} from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from './opal-user-state.mock';

export const USER_STATE_DOMAIN = 'configured-domain';
export const ALTERNATIVE_USER_STATE_DOMAIN = 'alternative-domain';
const ACTIVE_USER_STATE_RESPONSE_STATUS: OpalUserStateResponseStatus = 'ACTIVE';

export const USER_STATE_MOCK: IOpalUserStateResponse = {
  user_id: OPAL_USER_STATE_MOCK.user_id,
  username: OPAL_USER_STATE_MOCK.username,
  name: OPAL_USER_STATE_MOCK.name,
  status: ACTIVE_USER_STATE_RESPONSE_STATUS,
  version: OPAL_USER_STATE_MOCK.version,
  cache_name: 'user_state_test-user-id',
  domains: {
    [USER_STATE_DOMAIN]: {
      business_unit_users: OPAL_USER_STATE_MOCK.business_unit_users,
    },
    [ALTERNATIVE_USER_STATE_DOMAIN]: {
      business_unit_users: [
        {
          business_unit_user_id: 'C017KG',
          business_unit_id: 17,
          permissions: [
            {
              permission_id: 88,
              permission_name: 'Confiscation Permission',
            },
          ],
        },
      ],
    },
  },
};
