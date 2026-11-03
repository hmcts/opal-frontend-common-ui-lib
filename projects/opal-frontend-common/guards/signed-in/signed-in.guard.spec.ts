import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { signedInGuard } from './signed-in.guard';
import { throwError, of } from 'rxjs';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO } from '@hmcts/opal-frontend-common/guards/auth';

describe('signedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => signedInGuard(...guardParameters));

  let mockAuthService: AuthService;
  let mockRouter: Router;

  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;
  let currentNavigationMock: ReturnType<typeof vi.fn>;

  const urlPath = '/sign-in';
  const expectedUrl = '/';

  beforeEach(() => {
    checkAuthenticatedMock = vi.fn();
    mockAuthService = { checkAuthenticated: checkAuthenticatedMock } as unknown as AuthService;

    createUrlTreeMock = vi.fn(() => new UrlTree());
    currentNavigationMock = vi.fn(() => null);
    mockRouter = {
      createUrlTree: createUrlTreeMock,
      currentNavigation: currentNavigationMock,
    } as unknown as Router;

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

  it('redirects a signed-in user to the default route', async () => {
    checkAuthenticatedMock.mockReturnValue(of(true));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));

    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([expectedUrl]);
    expect(authenticated).toBeInstanceOf(UrlTree);
  });

  it('allows an unauthenticated user to access sign-in', async () => {
    checkAuthenticatedMock.mockReturnValue(of(false));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));

    expect(authenticated).toBe(true);
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('allows a redirect after a protected route has already checked authentication', async () => {
    currentNavigationMock.mockReturnValue({ extras: { info: UNAUTHENTICATED_SIGN_IN_REDIRECT_INFO } });

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));

    expect(authenticated).toBe(true);
    expect(checkAuthenticatedMock).not.toHaveBeenCalled();
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('allows access to sign-in when the legacy authentication endpoint returns 401', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));

    expect(authenticated).toBe(true);
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('redirects authentication service failures to the internal-server-error page', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503 })));

    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));

    expect(authenticated).toBeInstanceOf(UrlTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.internalServerError}`]);
  });
});
