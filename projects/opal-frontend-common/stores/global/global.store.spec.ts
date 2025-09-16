import { TestBed } from '@angular/core/testing';
import { GlobalStoreType } from './types/global-store.type';
import { GlobalStore } from './global.store';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { ITransferStateLaunchDarklyConfig } from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import {
  TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK,
  TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK,
} from '@hmcts/opal-frontend-common/services/transfer-state-service/mocks';
import { LAUNCH_DARKLY_CHANGE_FLAGS_MOCK } from '@hmcts/opal-frontend-common/services/launch-darkly-service/mocks';
import { IUserState } from '@hmcts/opal-frontend-common/services/user-service/interfaces';
import { USER_STATE_MOCK } from 'projects/opal-frontend-common/services/user-service/mocks/user-state.mock';

describe('GlobalStore', () => {
  let store: GlobalStoreType;

  beforeEach(() => {
    store = TestBed.inject(GlobalStore);
  });

  it('should initialise with the default state', () => {
    expect(store.authenticated()).toBeFalse();
    expect(store.error()).toEqual({ error: false, message: '' });
    expect(store.featureFlags()).toEqual({});
    expect(store.userState()).toEqual({} as IUserState);
    expect(store.ssoEnabled()).toBeFalse();
    expect(store.launchDarklyConfig()).toEqual({} as ITransferStateLaunchDarklyConfig);
    expect(store.tokenExpiry()).toEqual({} as ISessionTokenExpiry);
  });

  it('should update authenticated state', () => {
    store.setAuthenticated(true);
    expect(store.authenticated()).toBeTrue();
  });

  it('should update error state', () => {
    const errorState = { error: true, message: 'Test Error' };
    store.setError(errorState);
    expect(store.error()).toEqual(errorState);
  });

  it('should update feature flags', () => {
    const featureFlags = LAUNCH_DARKLY_CHANGE_FLAGS_MOCK;
    store.setFeatureFlags(featureFlags);
    expect(store.featureFlags()).toEqual(featureFlags);
  });

  it('should update user state', () => {
    const userState = USER_STATE_MOCK;
    store.setUserState(userState);
    expect(store.userState()).toEqual(userState);
  });

  it('should update SSO enabled state', () => {
    store.setSsoEnabled(true);
    expect(store.ssoEnabled()).toBeTrue();
  });

  it('should update LaunchDarkly config', () => {
    const config = TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK;
    store.setLaunchDarklyConfig(config);
    expect(store.launchDarklyConfig()).toEqual(config);
  });

  it('should update App Insights config', () => {
    const config = TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK;
    store.setAppInsightsConfig(config);
    expect(store.appInsightsConfig()).toEqual(config);
  });

  it('should update token expiry', () => {
    const tokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;
    store.setTokenExpiry(tokenExpiry);
    expect(store.tokenExpiry()).toEqual(tokenExpiry);
  });
});
