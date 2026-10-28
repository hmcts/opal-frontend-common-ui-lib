import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, type Routes } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDIRECT_TO_SSO, REDIRECT_TO_SSO_LOGOUT } from '@hmcts/opal-frontend-common/guards/auth';
import { signedInGuard } from '@hmcts/opal-frontend-common/guards/signed-in';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { authenticatedAccountGuard } from './authenticated-account.guard';

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
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
  });

  it('ends a mismatched session before redirecting to sign-in', async () => {
    checkAuthenticatedMock.mockReturnValueOnce(of(true)).mockReturnValueOnce(of(false));
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    await expect(router.navigateByUrl('/access-denied')).resolves.toBe(true);

    expect(router.url).toBe('/sign-in');
    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
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
});
