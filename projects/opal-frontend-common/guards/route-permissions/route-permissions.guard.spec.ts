import { TestBed, fakeAsync } from '@angular/core/testing';
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
  extraRouteData: Record<string, unknown> = {},
) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];

  dummyRoute.data = { ...extraRouteData, routePermissionId: [guardParameters] };

  const dummyState: RouterStateSnapshot = {
    url: urlPath,
    root: new ActivatedRouteSnapshot(),
  };
  const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

describe('routePermissionsGuard', () => {
  let mockPermissionsService: jasmine.SpyObj<PermissionsService>;
  let mockOpalUserService: jasmine.SpyObj<OpalUserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/manual-account-creation';

  beforeEach(() => {
    mockPermissionsService = jasmine.createSpyObj(routePermissionsGuard, ['getUniquePermissions']);

    mockOpalUserService = jasmine.createSpyObj(routePermissionsGuard, ['getLoggedInUserState']);
    mockOpalUserService.getLoggedInUserState.and.returnValue(of(OPAL_USER_STATE_MOCK));

    mockRouter = jasmine.createSpyObj(routePermissionsGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
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

  it('should return true if user has permission id', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([ROUTE_PERMISSIONS_MOCK['test-route']]);

    const guard = await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(guard).toBeTruthy();
  }));

  it('should re-route if no access', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([999]);
    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  }));

  it('should re-route no unique permission ids ', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  }));

  it('should re-route if no route permission ids ', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, null, urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  }));

  it('should re-route if route permission id does not exist', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, 999999999, urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${PAGES_ROUTING_PATHS.children.accessDenied}`]);
  }));

  it('should allow access to login if catches an error ', fakeAsync(async () => {
    mockOpalUserService.getLoggedInUserState.and.returnValue(throwError(() => 'Error'));
    const guard = await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(guard).toBeFalsy();
  }));

  it('should allow access when routePermissionId is undefined and fallback to empty array', fakeAsync(async () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([123]);

    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    dummyRoute.data = {}; // No routePermissionId defined

    const dummyState: RouterStateSnapshot = {
      url: urlPath,
      root: new ActivatedRouteSnapshot(),
    };

    const result = TestBed.runInInjectionContext(() => routePermissionsGuard(dummyRoute, dummyState));
    const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
    expect(authenticated).toBeTrue();
  }));

  it('should redirect to account created page when user status is not active', fakeAsync(async () => {
    mockOpalUserService.getLoggedInUserState.and.returnValue(
      of({
        ...OPAL_USER_STATE_MOCK,
        status: 'pending',
      }),
    );

    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);

    expect(mockPermissionsService.getUniquePermissions).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${PAGES_ROUTING_PATHS.children.accountCreated}`]);
  }));

  it('should redirect to custom account created path when provided in route data', fakeAsync(async () => {
    const customAccountCreatedPath = '/custom-account-created';
    mockOpalUserService.getLoggedInUserState.and.returnValue(
      of({
        ...OPAL_USER_STATE_MOCK,
        status: 'pending',
      }),
    );

    await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath, {
      accountCreatedPath: customAccountCreatedPath,
    });

    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([customAccountCreatedPath]);
  }));
});
