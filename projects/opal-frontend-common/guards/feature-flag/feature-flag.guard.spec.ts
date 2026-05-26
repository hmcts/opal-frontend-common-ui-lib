import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { featureFlagGuard, featureFlagRedirectGuard, resolveFeatureFlagGuard } from './feature-flag.guard';

describe('feature flag guards', () => {
  let featureFlagsMock: ReturnType<typeof vi.fn>;
  let initializeLaunchDarklyClientMock: ReturnType<typeof vi.fn>;
  let initializeLaunchDarklyFlagsMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: Mock;

  const runCanActivateGuard = (guard: CanActivateFn) =>
    TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  const runGuard = (flagKey: string) => runCanActivateGuard(featureFlagGuard(flagKey));

  beforeEach(() => {
    featureFlagsMock = vi.fn().mockReturnValue({ 'release-1a': true });
    initializeLaunchDarklyClientMock = vi.fn();
    initializeLaunchDarklyFlagsMock = vi.fn().mockResolvedValue(undefined);
    createUrlTreeMock = vi.fn();

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
        {
          provide: Router,
          useValue: {
            createUrlTree: createUrlTreeMock,
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

  it('should resolve the feature flag guard result to a boolean', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      resolveFeatureFlagGuard('release-1a', {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('should return true from the redirect guard when the requested feature flag is enabled', async () => {
    const result = await runCanActivateGuard(featureFlagRedirectGuard('release-1a'));

    expect(result).toBe(true);
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('should redirect to access denied from the redirect guard when the requested feature flag is disabled', async () => {
    const expectedUrlTree = new UrlTree();
    featureFlagsMock.mockReturnValue({ 'release-1a': false });
    createUrlTreeMock.mockReturnValue(expectedUrlTree);

    const result = await runCanActivateGuard(featureFlagRedirectGuard('release-1a'));

    expect(result).toBe(expectedUrlTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to the provided path from the redirect guard when the requested feature flag is disabled', async () => {
    const expectedUrlTree = new UrlTree();
    featureFlagsMock.mockReturnValue({ 'release-1a': false });
    createUrlTreeMock.mockReturnValue(expectedUrlTree);

    const result = await runCanActivateGuard(featureFlagRedirectGuard('release-1a', '/custom-denied'));

    expect(result).toBe(expectedUrlTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/custom-denied']);
  });
});
