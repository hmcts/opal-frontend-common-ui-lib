import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import {
  ITransferStateLaunchDarklyConfig,
  ISessionTokenExpiry,
  ISessionUserState,
  IErrorState,
} from '@hmcts/opal-frontend-common/core/interfaces';

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    authenticated: false,
    error: { error: false, message: '' },
    featureFlags: {} as LDFlagSet,
    userState: {} as ISessionUserState,
    ssoEnabled: false,
    launchDarklyConfig: {} as ITransferStateLaunchDarklyConfig,
    tokenExpiry: {} as ISessionTokenExpiry,
  })),
  withMethods((store) => ({
    setAuthenticated: (authenticated: boolean) => {
      patchState(store, { authenticated });
    },
    setError: (error: IErrorState) => {
      patchState(store, { error });
    },
    setFeatureFlags: (featureFlags: LDFlagSet) => {
      patchState(store, { featureFlags });
    },
    setUserState: (userState: ISessionUserState) => {
      patchState(store, { userState });
    },
    setSsoEnabled: (ssoEnabled: boolean) => {
      patchState(store, { ssoEnabled });
    },
    setLaunchDarklyConfig: (config: ITransferStateLaunchDarklyConfig) => {
      patchState(store, { launchDarklyConfig: config });
    },
    setTokenExpiry: (tokenExpiry: ISessionTokenExpiry) => {
      patchState(store, { tokenExpiry });
    },
  })),
);
