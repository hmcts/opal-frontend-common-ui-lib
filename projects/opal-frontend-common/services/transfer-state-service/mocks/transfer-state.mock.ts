import { ITransferStateServerState } from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import { TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK } from './transfer-state-launch-darkly-config.mock';
import { TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK } from './transfer-state-app-insights-config.mock';
import { TRANSFER_STATE_FEATURE_FLAG_CONFIG_MOCK } from './transfer-state-feature-flag-config.mock';

export const TRANSFER_STATE_MOCK: ITransferStateServerState = {
  launchDarklyConfig: TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK,
  ssoEnabled: true,
  appInsightsConfig: TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK,
  userStateCacheExpirationMilliseconds: 1800000,
  userStateDomain: 'configured-domain',
  featureFlagConfig: TRANSFER_STATE_FEATURE_FLAG_CONFIG_MOCK,
};
