import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { authGuard, REDIRECT_TO_SSO } from './auth.guard';
import { of, throwError } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let mockAuthService: AuthService;
  let mockRouter: Router;
  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let navigateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;
  let parseUrlMock: ReturnType<typeof vi.fn>;
  let globalStore: GlobalStoreType;
  let redirectToSsoLoginSpy: Mock;

  const urlPath = '/test-page';
  const expectedUrl = 'sign-in';

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
    redirectToSsoLoginSpy = vi.fn();

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
        { provide: REDIRECT_TO_SSO, useValue: redirectToSsoLoginSpy },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the user is logged in ', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));
    expect(authenticated).toBeTruthy();
  });

  it('should redirect to login with originalUrl and loggedOut url if catches an error ', async () => {
    globalStore.setSsoEnabled(false);
    checkAuthenticatedMock.mockReturnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  });

  it('should call redirectToSsoLogin if ssoEnabled is true and checkAuthenticated fails', async () => {
    globalStore.setSsoEnabled(true);
    checkAuthenticatedMock.mockReturnValue(throwError(() => new Error('Auth error')));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(executeGuard, urlPath));

    expect(redirectToSsoLoginSpy).toHaveBeenCalledTimes(1);

    expect(redirectToSsoLoginSpy).toHaveBeenCalledWith();
    expect(authenticated).toBe(false);
  });

  describe('REDIRECT_TO_SSO', () => {
    it('should trigger the redirect logic (coverage only)', () => {
      const redirectToSso = TestBed.inject(REDIRECT_TO_SSO);

      expect(() => redirectToSso()).not.toThrow();
    });
  });
});
