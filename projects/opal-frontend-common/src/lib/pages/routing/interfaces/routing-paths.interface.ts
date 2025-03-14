import { IChildRoutingPaths } from '../../../routing';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    accessDenied: string;
    signIn: string;
    signInStub: string;
  };
}
