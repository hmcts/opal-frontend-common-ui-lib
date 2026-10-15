import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDIRECT_TO_SSO } from '@hmcts/opal-frontend-common/guards/auth';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { authenticatedAccountGuard } from './authenticated-account.guard';

describe('authenticatedAccountGuard', () => {
  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let getLoggedInUserStateMock: ReturnType<typeof vi.fn>;
  let clearUserStateCacheMock: ReturnType<typeof vi.fn>;
  let navigateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;
  let globalStore: GlobalStoreType;

  const route = new ActivatedRouteSnapshot();
  route.url = [new UrlSegment('fines', {})];
  const state: RouterStateSnapshot = {
    url: '/fines',
    root: new ActivatedRouteSnapshot(),
  };

  const runGuard = () => {
    const result = TestBed.runInInjectionContext(() => authenticatedAccountGuard(route, state));

    return firstValueFrom(result as Observable<boolean | UrlTree>);
  };

  beforeEach(() => {
    checkAuthenticatedMock = vi.fn();
    getLoggedInUserStateMock = vi.fn();
    clearUserStateCacheMock = vi.fn();
    navigateMock = vi.fn();
    createUrlTreeMock = vi.fn(() => new UrlTree());

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { checkAuthenticated: checkAuthenticatedMock },
        },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: getLoggedInUserStateMock,
            clearUserStateCache: clearUserStateCacheMock,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: navigateMock,
            createUrlTree: createUrlTreeMock,
          },
        },
        { provide: REDIRECT_TO_SSO, useValue: vi.fn() },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setSsoEnabled(false);
  });

  it('allows navigation after authentication and an active user-state response', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    await expect(runGuard()).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(getLoggedInUserStateMock).toHaveBeenCalledTimes(1);
  });

  it('does not request user state until authentication has resolved true', async () => {
    const authentication$ = new Subject<boolean>();
    checkAuthenticatedMock.mockReturnValue(authentication$);
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    const navigationResult = runGuard();

    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();

    authentication$.next(true);

    await expect(navigationResult).resolves.toBe(true);
    expect(getLoggedInUserStateMock).toHaveBeenCalledTimes(1);
  });

  it('redirects an unauthenticated user without requesting user state', async () => {
    checkAuthenticatedMock.mockReturnValue(of(false));

    await expect(runGuard()).resolves.toBe(false);

    expect(navigateMock).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.signIn]);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
  });

  it('redirects a legacy authentication 401 without requesting user state', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await expect(runGuard()).resolves.toBe(false);

    expect(navigateMock).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.signIn]);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
  });

  it('redirects an authentication service failure to the internal-server-error page without requesting user state', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503 })));

    await runGuard();

    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
  });

  it('redirects users with a created account to the account-created page', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(of({ ...OPAL_USER_STATE_MOCK, status: 'created' }));

    await runGuard();

    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);
  });

  it('reauthenticates when the session expires between the authentication and user-state checks', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await expect(runGuard()).resolves.toBe(false);

    expect(clearUserStateCacheMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.signIn]);
  });

  it('redirects a user-state service failure to the internal-server-error page', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503 })));

    await runGuard();

    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);
  });
});
