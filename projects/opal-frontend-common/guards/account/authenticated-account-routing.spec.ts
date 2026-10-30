import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, type Routes } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDIRECT_TO_SSO, REDIRECT_TO_SSO_LOGOUT } from '@hmcts/opal-frontend-common/guards/auth';
import { signedInGuard } from '@hmcts/opal-frontend-common/guards/signed-in';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { authenticatedAccountGuard } from './authenticated-account.guard';
import { OPAL_USER_PATHS } from '../../services/opal-user-service/constants/opal-user-paths.constant';
import { USER_STATE_DOMAIN_MOCK } from '../../services/opal-user-service/mocks/user-state-domain.mock';
import { USER_STATE_MOCK } from '../../services/opal-user-service/mocks/opal-user-state-response.mock';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRouteComponent {}

const routes: Routes = [
  {
    path: 'access-denied',
    component: TestRouteComponent,
    canActivate: [authenticatedAccountGuard],
  },
  {
    path: 'sign-in',
    component: TestRouteComponent,
    canActivate: [signedInGuard],
  },
  {
    path: 'fines',
    component: TestRouteComponent,
    canActivateChild: [authenticatedAccountGuard],
    children: [
      {
        path: 'accounts/:accountId',
        component: TestRouteComponent,
        children: [
          { path: 'overview', component: TestRouteComponent },
          { path: 'history', component: TestRouteComponent },
        ],
      },
    ],
  },
];

describe('authenticated account routing', () => {
  let router: Router;
  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let getLoggedInUserStateMock: ReturnType<typeof vi.fn>;
  let logoutMock: ReturnType<typeof vi.fn>;
  let redirectToSsoLogoutMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    checkAuthenticatedMock = vi.fn().mockReturnValue(of(false));
    getLoggedInUserStateMock = vi.fn();
    logoutMock = vi.fn().mockReturnValue(of(undefined));
    redirectToSsoLogoutMock = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: AuthService,
          useValue: { checkAuthenticated: checkAuthenticatedMock, logout: logoutMock },
        },
        {
          provide: OpalUserService,
          useValue: {
            clearUserStateCache: vi.fn(),
            getLoggedInUserState: getLoggedInUserStateMock,
          },
        },
        { provide: REDIRECT_TO_SSO, useValue: vi.fn() },
        { provide: REDIRECT_TO_SSO_LOGOUT, useValue: redirectToSsoLogoutMock },
      ],
    });

    TestBed.inject(GlobalStore).setSsoEnabled(false);
    router = TestBed.inject(Router);
  });

  it('redirects an unauthenticated user from access denied to sign-in', async () => {
    await expect(router.navigateByUrl('/access-denied')).resolves.toBe(true);

    expect(router.url).toBe('/sign-in');
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
  });

  it('ends a mismatched session before redirecting to sign-in', async () => {
    checkAuthenticatedMock.mockReturnValueOnce(of(true)).mockReturnValueOnce(of(false));
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await expect(router.navigateByUrl('/access-denied')).resolves.toBe(true);

    expect(router.url).toBe('/sign-in');
    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(getLoggedInUserStateMock).toHaveBeenCalledTimes(1);
  });

  it('navigates the browser to SSO logout when the user-state request rejects an authenticated session', async () => {
    TestBed.inject(GlobalStore).setSsoEnabled(true);
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await expect(router.navigateByUrl('/access-denied')).resolves.toBe(false);

    expect(redirectToSsoLogoutMock).toHaveBeenCalledTimes(1);
    expect(logoutMock).not.toHaveBeenCalled();
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
  });

  it('shares authentication for a nested deep link', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    await expect(router.navigateByUrl('/fines/accounts/1/overview')).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
  });

  it('rechecks authentication on a later child navigation', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    await expect(router.navigateByUrl('/fines/accounts/1/overview')).resolves.toBe(true);
    await expect(router.navigateByUrl('/fines/accounts/1/history')).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
  });
});

describe('authenticated account routing HTTP sequencing', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REDIRECT_TO_SSO, useValue: vi.fn() },
        { provide: REDIRECT_TO_SSO_LOGOUT, useValue: vi.fn() },
      ],
    });

    TestBed.inject(GlobalStore).setSsoEnabled(false);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('does not request user state while authentication is pending or unauthenticated for a nested deep link', async () => {
    const navigation = router.navigateByUrl('/fines/accounts/1/overview');

    await new Promise((resolve) => setTimeout(resolve));

    const authenticationRequest = httpMock.expectOne(SSO_ENDPOINTS.authenticated);

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);

    authenticationRequest.flush(false);

    await expect(navigation).resolves.toBe(true);

    expect(router.url).toBe('/sign-in');
    httpMock.expectNone(SSO_ENDPOINTS.authenticated);
    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
    httpMock.verify();
  });

  it('makes one authentication request for a nested deep link when user state is cached', async () => {
    const globalStore = TestBed.inject(GlobalStore);
    const opalUserService = TestBed.inject(OpalUserService);
    globalStore.setUserStateDomain(USER_STATE_DOMAIN_MOCK);

    const cachedUserState = firstValueFrom(opalUserService.getLoggedInUserState());
    const userStateRequest = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    userStateRequest.flush(USER_STATE_MOCK);

    await expect(cachedUserState).resolves.toMatchObject({ status: 'active' });

    const navigation = router.navigateByUrl('/fines/accounts/1/overview');

    await new Promise((resolve) => setTimeout(resolve));

    const authenticationRequest = httpMock.expectOne(SSO_ENDPOINTS.authenticated);
    authenticationRequest.flush(true);

    await new Promise((resolve) => setTimeout(resolve));

    httpMock.expectNone(SSO_ENDPOINTS.authenticated);
    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
    await expect(navigation).resolves.toBe(true);
    expect(router.url).toBe('/fines/accounts/1/overview');
    httpMock.verify();
  });
});
