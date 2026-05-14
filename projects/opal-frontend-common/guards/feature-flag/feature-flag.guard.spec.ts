import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { featureFlagGuard } from './feature-flag.guard';

describe('featureFlagGuard', () => {
  let featureFlagsMock: ReturnType<typeof vi.fn>;
  let initializeLaunchDarklyFlagsMock: ReturnType<typeof vi.fn>;

  const runGuard = (flagKey: string) =>
    TestBed.runInInjectionContext(() =>
      featureFlagGuard(flagKey)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    featureFlagsMock = vi.fn().mockReturnValue({ 'release-1a': true });
    initializeLaunchDarklyFlagsMock = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: GlobalStore,
          useValue: {
            featureFlags: featureFlagsMock,
          },
        },
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyFlags: initializeLaunchDarklyFlagsMock,
          },
        },
      ],
    });
  });

  it('should return true when the requested feature flag is enabled', async () => {
    const result = await runGuard('release-1a');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).not.toHaveBeenCalled();
  });

  it('should return false when the requested feature flag is disabled', async () => {
    featureFlagsMock.mockReturnValue({ 'release-1a': false });

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
    expect(initializeLaunchDarklyFlagsMock).not.toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly flags when the requested feature flag is missing', async () => {
    featureFlagsMock.mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });

    const result = await runGuard('release-1a');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).toHaveBeenCalledTimes(1);
  });

  it('should return false when the requested feature flag is still missing after LaunchDarkly initializes', async () => {
    featureFlagsMock.mockReturnValue({});

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
    expect(initializeLaunchDarklyFlagsMock).toHaveBeenCalledTimes(1);
  });

  it('should return false when LaunchDarkly initialization fails', async () => {
    featureFlagsMock.mockReturnValue({});
    initializeLaunchDarklyFlagsMock.mockRejectedValue(new Error('LaunchDarkly failed'));

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
  });

  it('should check the feature flag key passed to the guard', async () => {
    featureFlagsMock.mockReturnValue({ 'release-1c': true });

    const result = await runGuard('release-1c');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).not.toHaveBeenCalled();
  });
});
