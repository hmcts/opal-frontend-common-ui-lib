import { inject } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanActivateFn,
  Router,
  type RouterStateSnapshot,
} from '@angular/router';
import { resolveGuardResult } from '@hmcts/opal-frontend-common/guards/helpers';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

const isFeatureFlagPopulated = (featureFlags: LDFlagSet | undefined, flagKey: string): boolean =>
  featureFlags?.[flagKey] !== undefined;

const isFeatureFlagEnabled = (featureFlags: LDFlagSet | undefined, flagKey: string): boolean =>
  featureFlags?.[flagKey] === true;

/**
 * Resolves a feature flag route guard to a boolean result.
 *
 * @param flagKey - The key of the feature flag to check
 * @param route - The activated route snapshot passed to the guard
 * @param state - The router state snapshot passed to the guard
 * @returns A boolean that is true only when the feature flag guard allows access
 *
 */
export const resolveFeatureFlagGuard = async (
  flagKey: string,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => (await resolveGuardResult(featureFlagGuard(flagKey)(route, state))) === true;

/**
 * Creates a route guard that checks if a specific feature flag is enabled before allowing access.
 *
 * @param flagKey - The key of the feature flag to check
 * @returns A CanActivateFn that returns true if the feature flag is enabled, false otherwise
 *
 */
export function featureFlagGuard(flagKey: string): CanActivateFn {
  return async () => {
    const globalStore = inject(GlobalStore);
    const launchDarklyService = inject(LaunchDarklyService);

    if (isFeatureFlagPopulated(globalStore.featureFlags(), flagKey)) {
      return isFeatureFlagEnabled(globalStore.featureFlags(), flagKey);
    }

    try {
      await launchDarklyService.initializeLaunchDarklyFlags();

      if (isFeatureFlagPopulated(globalStore.featureFlags(), flagKey)) {
        return isFeatureFlagEnabled(globalStore.featureFlags(), flagKey);
      }

      launchDarklyService.initializeLaunchDarklyClient();
      await launchDarklyService.initializeLaunchDarklyFlags();

      return isFeatureFlagEnabled(globalStore.featureFlags(), flagKey);
    } catch (error) {
      console.warn(`Feature flag "${flagKey}" could not be resolved. Access denied by featureFlagGuard.`, error);
      return false;
    }
  };
}

/**
 * Creates a route guard that redirects when a specific feature flag is not enabled.
 *
 * @param flagKey - The key of the feature flag to check
 * @param redirectPath - The path to redirect to when the feature flag is not enabled
 * @returns A CanActivateFn that returns true if the feature flag is enabled, otherwise a UrlTree
 *
 */
export function featureFlagRedirectGuard(
  flagKey: string,
  redirectPath = `/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`,
): CanActivateFn {
  return async (route, state) => {
    const router = inject(Router);
    const canActivate = await resolveFeatureFlagGuard(flagKey, route, state);

    return canActivate ? true : router.createUrlTree([redirectPath]);
  };
}
