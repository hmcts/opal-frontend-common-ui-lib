import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
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
  let createUrlTreeMock: ReturnType<typeof vi.fn>;

  const urlPath = '/sign-in';
  const expectedUrl = '/';

  beforeEach(() => {
    checkAuthenticatedMock = vi.fn();
    mockAuthService = { checkAuthenticated: checkAuthenticatedMock } as unknown as AuthService;

    createUrlTreeMock = vi.fn(() => new UrlTree());
    mockRouter = {
      createUrlTree: createUrlTreeMock,
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

  it('should allow access to login if catches an error ', async () => {
    checkAuthenticatedMock.mockReturnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));
    expect(authenticated).toBeTruthy();
  });
});
