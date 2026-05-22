import type { OpalUserStateStatus } from '../interfaces/opal-user-state-status.type';
import type { OpalUserStateResponseStatus } from '../interfaces/opal-user-state-response-status.type';

/**
 * Maps Redis-backed user-state response statuses to the existing frontend user-state contract.
 *
 * Keep the input type as {@link OpalUserStateResponseStatus} and the output type as {@link OpalUserStateStatus}
 * because the two contracts intentionally differ. In particular, the API returns `PENDING`, while the frontend
 * account guard and consumers expect `created`.
 */
export const OPAL_USER_STATE_RESPONSE_STATUS = {
  ACTIVE: 'active',
  PENDING: 'created',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
} as const satisfies Record<OpalUserStateResponseStatus, OpalUserStateStatus>;
