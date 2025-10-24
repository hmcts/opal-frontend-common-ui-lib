import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

export interface IOpalUserStateCached {
  userState: IOpalUserState | null;
  expiryAt: string | null;
}
