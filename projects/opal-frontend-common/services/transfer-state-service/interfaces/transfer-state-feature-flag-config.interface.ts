import { LDFlagSet } from 'launchdarkly-js-client-sdk';

export interface ITransferStateFeatureFlagConfig {
  override: boolean | null;
  releases: LDFlagSet;
}
