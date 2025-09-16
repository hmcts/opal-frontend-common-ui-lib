import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import {
  ITransferStateLaunchDarklyConfig,
  ITransferStateAppInsightsConfig,
} from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { IErrorState } from '@hmcts/opal-frontend-common/stores/global/interfaces';
import { IUserState } from '@hmcts/opal-frontend-common/services/user-service/interfaces';

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    authenticated: false,
    error: { error: false, message: '' },
    featureFlags: {} as LDFlagSet,
    userState: {} as IUserState,
    ssoEnabled: false,
    launchDarklyConfig: {} as ITransferStateLaunchDarklyConfig,
    appInsightsConfig: {} as ITransferStateAppInsightsConfig,
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
    setUserState: (userState: IUserState) => {
      patchState(store, { userState });
    },
    setSsoEnabled: (ssoEnabled: boolean) => {
      patchState(store, { ssoEnabled });
    },
    setLaunchDarklyConfig: (config: ITransferStateLaunchDarklyConfig) => {
      patchState(store, { launchDarklyConfig: config });
    },
    setAppInsightsConfig: (config: ITransferStateAppInsightsConfig) => {
      patchState(store, { appInsightsConfig: config });
    },
    setTokenExpiry: (tokenExpiry: ISessionTokenExpiry) => {
      patchState(store, { tokenExpiry });
    },
  })),
);
