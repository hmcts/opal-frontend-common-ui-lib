import { IPagesRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export const PAGES_ROUTING_PATHS: IPagesRoutingPaths = {
  root: '',
  children: {
    accessDenied: 'access-denied',
    internalServerError: 'error/internal-server',
    signIn: 'sign-in',
    signInStub: 'sign-in-stub',
  },
};
