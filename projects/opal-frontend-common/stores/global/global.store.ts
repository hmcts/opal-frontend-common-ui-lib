import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import {
  ITransferStateLaunchDarklyConfig,
  ITransferStateAppInsightsConfig,
} from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import {
  ISessionTokenExpiry,
  ISessionUserState,
} from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { IErrorState } from '@hmcts/opal-frontend-common/stores/global/interfaces';

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    authenticated: false,
    error: { error: false, message: '' },
    featureFlags: {} as LDFlagSet,
    userState: {} as ISessionUserState,
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
    setUserState: (userState: ISessionUserState) => {
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
