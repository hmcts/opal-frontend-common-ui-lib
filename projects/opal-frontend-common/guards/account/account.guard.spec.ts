import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { accountGuard } from './account.guard';
import { UserStateService } from '@hmcts/opal-frontend-common/services/user-state-service';
import { of, throwError, Observable } from 'rxjs';
import { handleObservableResult } from '../helpers/handle-observable-result';
import { IUserState } from '@hmcts/opal-frontend-common/services/user-state-service/interfaces';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const USER_STATE_MOCK: IUserState = {
  user_id: 12345,
  username: 'test-user',
  name: 'Test User',
  status: 'ACTIVE',
  version: 1,
  cache_name: 'user_state_test-user-id',
  domains: {
    fines: {
      business_unit_users: [],
    },
  },
};

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
  let mockUserStateService: UserStateService;
  let mockRouter: Router;
  let getUserStateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;

  const urlPath = '/manual-account-creation';
  const accountCreatedPath = `/${PAGES_ROUTING_PATHS.children.accountCreated}`;

  beforeEach(() => {
    getUserStateMock = vi.fn();
    mockUserStateService = { getUserState: getUserStateMock } as unknown as UserStateService;
    getUserStateMock.mockReturnValue(of(USER_STATE_MOCK));

    createUrlTreeMock = vi.fn().mockImplementation(() => new UrlTree());
    mockRouter = { createUrlTree: createUrlTreeMock } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserStateService,
          useValue: mockUserStateService,
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

  it('should allow access when the user status is ACTIVE', async () => {
    getUserStateMock.mockReturnValue(of(USER_STATE_MOCK));

    const result = await runAccountGuard(accountGuard, urlPath);

    expect(result).toBe(true);
    expect(mockUserStateService.getUserState).toHaveBeenCalledTimes(1);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to account created path when the user status is PENDING', async () => {
    getUserStateMock.mockReturnValue(
      of({
        ...USER_STATE_MOCK,
        status: 'PENDING',
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to account created path when the user status is missing', async () => {
    getUserStateMock.mockReturnValue(
      of({
        ...USER_STATE_MOCK,
        status: null,
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to account created path when the user status is SUSPENDED', async () => {
    getUserStateMock.mockReturnValue(
      of({
        ...USER_STATE_MOCK,
        status: 'SUSPENDED',
      }),
    );

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });

  it('should redirect to account created path when fetching user state fails', async () => {
    getUserStateMock.mockReturnValue(throwError(() => new Error('Failed to load user state')));

    await runAccountGuard(accountGuard, urlPath);

    expect(mockRouter.createUrlTree).toHaveBeenCalledTimes(1);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([accountCreatedPath]);
  });
});
