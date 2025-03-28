import { IChildRoutingPaths } from './child-routing-paths.interface';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    accessDenied: string;
    signIn: string;
    signInStub: string;
  };
}
