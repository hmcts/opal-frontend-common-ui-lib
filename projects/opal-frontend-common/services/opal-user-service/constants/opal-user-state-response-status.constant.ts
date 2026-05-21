import type { OpalUserStateResponseStatus } from '../interfaces/opal-user-state-response-status.type';

export const OPAL_USER_STATE_RESPONSE_STATUS = {
  active: 'ACTIVE',
  pending: 'PENDING',
  suspended: 'SUSPENDED',
  deactivated: 'DEACTIVATED',
} as const satisfies Record<string, OpalUserStateResponseStatus>;
