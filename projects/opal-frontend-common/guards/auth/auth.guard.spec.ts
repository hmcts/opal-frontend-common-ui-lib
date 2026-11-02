import { DOCUMENT } from '@angular/common';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, RedirectCommand, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { authGuard, REDIRECT_TO_SSO, REDIRECT_TO_SSO_LOGOUT, SERVER_SSO_REDIRECT } from './auth.guard';
import { of, throwError } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';

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
  let clearUserStateCacheMock: ReturnType<typeof vi.fn>;

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
    clearUserStateCacheMock = vi.fn();

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
        { provide: OpalUserService, useValue: { clearUserStateCache: clearUserStateCacheMock } },
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

  it('redirects 200 false to sign-in and clears cached user state', async () => {
    globalStore.setSsoEnabled(false);
    checkAuthenticatedMock.mockReturnValue(of(false));

    const result = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(createUrlTreeMock).toHaveBeenCalledWith([expectedUrl]);
    expect(clearUserStateCacheMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('redirects a legacy 401 to sign-in', async () => {
    globalStore.setSsoEnabled(false);
    checkAuthenticatedMock.mockReturnValue(throwError(() => ({ status: 401 })));

    const result = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(createUrlTreeMock).toHaveBeenCalledWith([expectedUrl]);
    expect(clearUserStateCacheMock).toHaveBeenCalledTimes(1);
  });

  it('redirects 200 false to SSO login', async () => {
    globalStore.setSsoEnabled(true);
    checkAuthenticatedMock.mockReturnValue(of(false));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));

    expect(redirectToSsoLoginSpy).toHaveBeenCalledTimes(1);
    expect(clearUserStateCacheMock).toHaveBeenCalledTimes(1);
    expect(authenticated).toBe(false);
  });

  it('routes authentication service failures to the internal error page', async () => {
    globalStore.setSsoEnabled(true);
    checkAuthenticatedMock.mockReturnValue(throwError(() => ({ status: 503 })));

    await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));

    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);
    expect(redirectToSsoLoginSpy).not.toHaveBeenCalled();
    expect(clearUserStateCacheMock).not.toHaveBeenCalled();
  });

  describe('REDIRECT_TO_SSO', () => {
    const setupDefaultRedirectToSso = ({
      platformId,
      document,
      serverRedirect,
    }: {
      platformId: 'browser' | 'server';
      document: { location: { href: string } };
      serverRedirect?: ReturnType<typeof vi.fn>;
    }) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          { provide: DOCUMENT, useValue: document },
          ...(serverRedirect ? [{ provide: SERVER_SSO_REDIRECT, useValue: serverRedirect }] : []),
        ],
      });

      return TestBed.inject(REDIRECT_TO_SSO);
    };

    it('should set the injected document location href to the SSO login endpoint on the browser platform', () => {
      const document = { location: { href: '' } };
      const serverRedirect = vi.fn();

      const redirectToSso = setupDefaultRedirectToSso({ platformId: 'browser', document, serverRedirect });

      redirectToSso();

      expect(document.location.href).toBe(SSO_ENDPOINTS.login);
      expect(serverRedirect).not.toHaveBeenCalled();
    });

    it('records a server-side login redirect without changing the document location', () => {
      const document = { location: { href: '' } };
      const serverRedirect = vi.fn();
      vi.stubGlobal('location', undefined);

      const redirectToSso = setupDefaultRedirectToSso({ platformId: 'server', document, serverRedirect });

      try {
        expect(() => redirectToSso()).not.toThrow();
      } finally {
        vi.unstubAllGlobals();
      }

      expect(document.location.href).toBe('');
      expect(serverRedirect).toHaveBeenCalledTimes(1);
      expect(serverRedirect).toHaveBeenCalledWith('login');
    });
  });

  describe('REDIRECT_TO_SSO_LOGOUT', () => {
    const setupDefaultRedirectToSsoLogout = ({
      platformId,
      document,
      serverRedirect,
    }: {
      platformId: 'browser' | 'server';
      document: { location: { href: string } };
      serverRedirect?: ReturnType<typeof vi.fn>;
    }) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          { provide: DOCUMENT, useValue: document },
          ...(serverRedirect ? [{ provide: SERVER_SSO_REDIRECT, useValue: serverRedirect }] : []),
        ],
      });

      return TestBed.inject(REDIRECT_TO_SSO_LOGOUT);
    };

    it('should set the injected document location href to the SSO logout endpoint on the browser platform', () => {
      const document = { location: { href: '' } };
      const serverRedirect = vi.fn();

      const redirectToSsoLogout = setupDefaultRedirectToSsoLogout({ platformId: 'browser', document, serverRedirect });

      redirectToSsoLogout();

      expect(document.location.href).toBe(SSO_ENDPOINTS.logout);
      expect(serverRedirect).not.toHaveBeenCalled();
    });

    it('records a server-side logout redirect without changing the document location', () => {
      const document = { location: { href: '' } };
      const serverRedirect = vi.fn();
      vi.stubGlobal('location', undefined);

      const redirectToSsoLogout = setupDefaultRedirectToSsoLogout({ platformId: 'server', document, serverRedirect });

      try {
        expect(() => redirectToSsoLogout()).not.toThrow();
      } finally {
        vi.unstubAllGlobals();
      }

      expect(document.location.href).toBe('');
      expect(serverRedirect).toHaveBeenCalledTimes(1);
      expect(serverRedirect).toHaveBeenCalledWith('logout');
    });
  });
});
