import { IChildRoutingPaths } from './child-routing-paths.interface';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    accessDenied: string;
    concurrencyFailure: string;
    permissionDenied: string;
    internalServerError: string;
    signIn: string;
    signInStub: string;
  };
}
