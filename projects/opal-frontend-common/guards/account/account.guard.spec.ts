import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { accountGuard } from './account.guard';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { of, throwError, Observable } from 'rxjs';
import { handleObservableResult } from '../helpers/handle-observable-result';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

async function runAccountGuard(guard: typeof accountGuard, urlPath: string) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];

  const dummyState: RouterStateSnapshot = {
    url: urlPath,
    root: new ActivatedRouteSnapshot(),
  };
  const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

describe('accountGuard', () => {
  let mockOpalUserService: OpalUserService;
  let mockRouter: Router;
  let getLoggedInUserStateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;

  const urlPath = '/manual-account-creation';
  const accountCreatedPath = `/${PAGES_ROUTING_PATHS.children.accountCreated}`;

  beforeEach(() => {
    getLoggedInUserStateMock = vi.fn();
    mockOpalUserService = { getLoggedInUserState: getLoggedInUserStateMock } as unknown as OpalUserService;
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    createUrlTreeMock = vi.fn().mockImplementation(() => new UrlTree());
    mockRouter = { createUrlTree: createUrlTreeMock } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: OpalUserService,
          useValue: mockOpalUserService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should allow access when the user status is active', async () => {
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

    const result = await runAccountGuard(accountGuard, urlPath);

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to account created path when the user status is created', async () => {
    getLoggedInUserStateMock.mockReturnValue(
      of({
        ...OPAL_USER_STATE_MOCK,
        status: 'created',
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to account created path when the user status is missing', async () => {
    getLoggedInUserStateMock.mockReturnValue(
      of({
        ...OPAL_USER_STATE_MOCK,
        status: null,
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to custom account created path when provided in route data', async () => {
    getLoggedInUserStateMock.mockReturnValue(
      of({
        ...OPAL_USER_STATE_MOCK,
        status: 'created',
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to account created path when fetching user state fails', async () => {
    getLoggedInUserStateMock.mockReturnValue(throwError(() => new Error('Failed to load user state')));

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });
});
