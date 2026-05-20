import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { featureFlagGuard } from './feature-flag.guard';

describe('featureFlagGuard', () => {
  let featureFlagsMock: ReturnType<typeof vi.fn>;
  let initializeLaunchDarklyClientMock: ReturnType<typeof vi.fn>;
  let initializeLaunchDarklyFlagsMock: ReturnType<typeof vi.fn>;

  const runGuard = (flagKey: string) =>
    TestBed.runInInjectionContext(() =>
      featureFlagGuard(flagKey)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    featureFlagsMock = vi.fn().mockReturnValue({ 'release-1a': true });
    initializeLaunchDarklyClientMock = vi.fn();
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
            initializeLaunchDarklyClient: initializeLaunchDarklyClientMock,
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
    expect(initializeLaunchDarklyClientMock).not.toHaveBeenCalled();
  });

  it('should return false when the requested feature flag is disabled', async () => {
    featureFlagsMock.mockReturnValue({ 'release-1a': false });

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
    expect(initializeLaunchDarklyFlagsMock).not.toHaveBeenCalled();
    expect(initializeLaunchDarklyClientMock).not.toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly flags when the requested feature flag is missing', async () => {
    featureFlagsMock.mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });

    const result = await runGuard('release-1a');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).toHaveBeenCalledTimes(1);
    expect(initializeLaunchDarklyClientMock).not.toHaveBeenCalled();
  });

  it('should initialize the LaunchDarkly client and retry flags when the requested feature flag remains missing', async () => {
    featureFlagsMock.mockReturnValueOnce({}).mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });

    const result = await runGuard('release-1a');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).toHaveBeenCalledTimes(2);
    expect(initializeLaunchDarklyClientMock).toHaveBeenCalledTimes(1);
  });

  it('should return false when the requested feature flag is still missing after LaunchDarkly initializes', async () => {
    featureFlagsMock.mockReturnValue({});

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
    expect(initializeLaunchDarklyFlagsMock).toHaveBeenCalledTimes(2);
    expect(initializeLaunchDarklyClientMock).toHaveBeenCalledTimes(1);
  });

  it('should return false when LaunchDarkly initialization fails', async () => {
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    featureFlagsMock.mockReturnValue({});
    const error = new Error('LaunchDarkly failed');
    initializeLaunchDarklyFlagsMock.mockRejectedValue(error);

    const result = await runGuard('release-1a');

    expect(result).toBe(false);
    expect(initializeLaunchDarklyClientMock).not.toHaveBeenCalled();
    expect(consoleWarnMock).toHaveBeenCalledWith(
      'Feature flag "release-1a" could not be resolved. Access denied by featureFlagGuard.',
      error,
    );
    consoleWarnMock.mockRestore();
  });

  it('should check the feature flag key passed to the guard', async () => {
    featureFlagsMock.mockReturnValue({ 'release-1c': true });

    const result = await runGuard('release-1c');

    expect(result).toBe(true);
    expect(initializeLaunchDarklyFlagsMock).not.toHaveBeenCalled();
    expect(initializeLaunchDarklyClientMock).not.toHaveBeenCalled();
  });
});
