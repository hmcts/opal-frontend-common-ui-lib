import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

const isFeatureFlagPopulated = (featureFlags: LDFlagSet | undefined, flagKey: string): boolean =>
  featureFlags?.[flagKey] !== undefined;

const isFeatureFlagEnabled = (featureFlags: LDFlagSet | undefined, flagKey: string): boolean =>
  featureFlags?.[flagKey] === true;

export function featureFlagGuard(flagKey: string): CanActivateFn {
  return async () => {
    const globalStore = inject(GlobalStore);
    const launchDarklyService = inject(LaunchDarklyService);

    if (isFeatureFlagPopulated(globalStore.featureFlags(), flagKey)) {
      return isFeatureFlagEnabled(globalStore.featureFlags(), flagKey);
    }

    try {
      await launchDarklyService.initializeLaunchDarklyFlags();
      return isFeatureFlagEnabled(globalStore.featureFlags(), flagKey);
    } catch (error) {
      console.warn(`Feature flag "${flagKey}" could not be resolved. Access denied by featureFlagGuard.`, error);
      return false;
    }
  };
}
