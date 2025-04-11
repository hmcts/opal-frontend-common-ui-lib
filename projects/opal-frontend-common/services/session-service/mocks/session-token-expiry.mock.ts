import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';

export const SESSION_TOKEN_EXPIRY_MOCK: ISessionTokenExpiry = {
  expiry: 'test',
  warningThresholdInMilliseconds: 5,
};
