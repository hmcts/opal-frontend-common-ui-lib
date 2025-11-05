import { IPagesRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export const PAGES_ROUTING_PATHS: IPagesRoutingPaths = {
  root: '',
  children: {
    accessDenied: 'access-denied',
    concurrencyFailure: 'error/concurrency-failure',
    permissionDenied: 'error/permission-denied',
    internalServerError: 'error/internal-server-error',
    signIn: 'sign-in',
    signInStub: 'sign-in-stub',
  },
};
