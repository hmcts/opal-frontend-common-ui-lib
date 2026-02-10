import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';
import { routePermissionsGuard } from './route-permissions.guard';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { handleObservableResult } from '../helpers/handle-observable-result';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { ROUTE_PERMISSIONS_MOCK } from './mocks/route-permissions.mock';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';

async function runRoutePermissionGuard(
  guard: typeof routePermissionsGuard,
  guardParameters: number | null,
  urlPath: string,
) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];

  dummyRoute.data = { routePermissionId: [guardParameters] };

  const dummyState: RouterStateSnapshot = {
    url: urlPath,
    root: new ActivatedRouteSnapshot(),
  };
  const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

describe('routePermissionsGuard', () => {
  let mockPermissionsService: PermissionsService;
  let mockOpalUserService: OpalUserService;
  let mockRouter: Router;

  let getUniquePermissionsMock: ReturnType<typeof vi.fn>;
  let getLoggedInUserStateMock: ReturnType<typeof vi.fn>;
  let navigateMock: ReturnType<typeof vi.fn>;
  let createUrlTreeMock: ReturnType<typeof vi.fn>;
  let parseUrlMock: ReturnType<typeof vi.fn>;

  const urlPath = '/manual-account-creation';

  beforeEach(() => {
    getUniquePermissionsMock = vi.fn();
    mockPermissionsService = { getUniquePermissions: getUniquePermissionsMock } as unknown as PermissionsService;

    getLoggedInUserStateMock = vi.fn();
    mockOpalUserService = { getLoggedInUserState: getLoggedInUserStateMock } as unknown as OpalUserService;
    getLoggedInUserStateMock.mockReturnValue(of(OPAL_USER_STATE_MOCK));

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
      imports: [],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
        {
          provide: OpalUserService,
          useValue: mockOpalUserService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should return true if user has permission id', async () => {
    getUniquePermissionsMock.mockReturnValue([ROUTE_PERMISSIONS_MOCK['test-route']]);

    const guard = await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(guard).toBeTruthy();
  });

  it('should re-route if no access', async () => {
    getUniquePermissionsMock.mockReturnValue([999]);
    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should re-route no unique permission ids ', async () => {
    getUniquePermissionsMock.mockReturnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should re-route if no route permission ids ', async () => {
    getUniquePermissionsMock.mockReturnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, null, urlPath);
    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should re-route if route permission id does not exist', async () => {
    getUniquePermissionsMock.mockReturnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, 999999999, urlPath);
    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow access to login if catches an error ', async () => {
    getLoggedInUserStateMock.mockReturnValue(throwError(() => 'Error'));
    const guard = await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(guard).toBeFalsy();
  });

  it('should allow access when routePermissionId is undefined and fallback to empty array', async () => {
    getUniquePermissionsMock.mockReturnValue([123]);

    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    dummyRoute.data = {}; // No routePermissionId defined

    const dummyState: RouterStateSnapshot = {
      url: urlPath,
      root: new ActivatedRouteSnapshot(),
    };

    const result = TestBed.runInInjectionContext(() => routePermissionsGuard(dummyRoute, dummyState));
    const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
    expect(authenticated).toBe(true);
  });
});
