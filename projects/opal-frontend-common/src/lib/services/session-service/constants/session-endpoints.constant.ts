import { ISessionEndpoints } from '@services/session-service/interfaces/session-endpoints.interface';

export const SESSION_ENDPOINTS: ISessionEndpoints = {
  userState: '/session/user-state',
  expiry: '/session/expiry',
};
