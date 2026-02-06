import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { signedInGuard } from './signed-in.guard';
import { throwError, of } from 'rxjs';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';

describe('signedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => signedInGuard(...guardParameters));

  let mockAuthService: AuthService;
  let mockRouter: Router;

  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let navigateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;
  let parseUrlMock: ReturnType<typeof vi.fn>;

  const urlPath = '/sign-in';
  const expectedUrl = '/';

  beforeEach(() => {
    checkAuthenticatedMock = vi.fn();
    mockAuthService = { checkAuthenticated: checkAuthenticatedMock } as unknown as AuthService;

    navigateMock = vi.fn();
    createUrlTreeMock = vi.fn();
    parseUrlMock = vi.fn();
    mockRouter = {
      navigate: navigateMock,
      createUrlTree: createUrlTreeMock,
      parseUrl: parseUrlMock,
    } as unknown as Router;

    parseUrlMock.mockImplementation((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false if the user is logged in and redirect to the default route', async () => {
    mockIsLoggedInFalse();
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));
    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  });

  it('should allow access to login if catches an error ', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));
    expect(authenticated).toBeTruthy();
  });

  const mockIsLoggedInFalse = () => {
    checkAuthenticatedMock.mockReturnValue(of(false));
  };
});
