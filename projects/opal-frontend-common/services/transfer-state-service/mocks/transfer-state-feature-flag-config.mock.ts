import { ITransferStateFeatureFlagConfig } from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';

export const TRANSFER_STATE_FEATURE_FLAG_CONFIG_MOCK: ITransferStateFeatureFlagConfig = {
  override: true,
  releases: {
    'release-1a': true,
    'release-1b': true,
  },
};
