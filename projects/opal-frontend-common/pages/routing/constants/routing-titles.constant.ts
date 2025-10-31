import { IPagesRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export const PAGES_ROUTING_TITLES: IPagesRoutingPaths = {
  root: '',
  children: {
    accessDenied: 'Access denied',
    concurrencyFailure: 'Sorry, there is a problem',
    permissionDenied: 'Permission denied',
    internalServerError: 'Sorry, there is a problem with the service',
    signIn: 'Sign in',
    signInStub: 'Sign in',
  },
};
