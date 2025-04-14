import { ISsoEndpoints } from '@hmcts/opal-frontend-common/services/auth-service/interfaces';

export const SSO_ENDPOINTS: ISsoEndpoints = {
  login: '/sso/login',
  logout: '/sso/logout',
  callback: '/sso/callback',
  authenticated: '/sso/authenticated',
};
