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
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';

describe('GlobalStore', () => {
  let store: GlobalStoreType;

  beforeEach(() => {
    store = TestBed.inject(GlobalStore);
  });

  it('should initialise with the default state', () => {
    expect(store.authenticated()).toBeFalse();
    expect(store.error()).toEqual({ ...GLOBAL_ERROR_STATE });
    expect(store.featureFlags()).toEqual({});
    expect(store.userState()).toEqual({} as IOpalUserState);
    expect(store.ssoEnabled()).toBeFalse();
    expect(store.launchDarklyConfig()).toEqual({} as ITransferStateLaunchDarklyConfig);
    expect(store.tokenExpiry()).toEqual({} as ISessionTokenExpiry);
    expect(store.userStateCacheExpirationMilliseconds()).toBe(1800000);
  });

  it('should update authenticated state', () => {
    store.setAuthenticated(true);
    expect(store.authenticated()).toBeTrue();
  });

  it('should update error state', () => {
    const errorState = {
      ...GLOBAL_ERROR_STATE,
      error: true,
      message: 'Test Error',
      title: 'Test Title',
      operationId: '12345',
    };
    store.setError(errorState);
    expect(store.error()).toEqual(errorState);
  });

  it('should update feature flags', () => {
    const featureFlags = LAUNCH_DARKLY_CHANGE_FLAGS_MOCK;
    store.setFeatureFlags(featureFlags);
    expect(store.featureFlags()).toEqual(featureFlags);
  });

  it('should update user state', () => {
    const userState = OPAL_USER_STATE_MOCK;
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
  it('should reset error state', () => {
    store.resetError();
    expect(store.error()).toEqual(GLOBAL_ERROR_STATE);
  });

  it('should update user state cache expiration milliseconds', () => {
    const expirationMilliseconds = 45 * 60 * 1000; // Convert minutes to milliseconds
    store.setUserStateCacheExpirationMilliseconds(expirationMilliseconds);
    expect(store.userStateCacheExpirationMilliseconds()).toBe(expirationMilliseconds);
  });
});
