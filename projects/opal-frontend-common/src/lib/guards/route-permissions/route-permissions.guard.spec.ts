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
import { PermissionsService } from '../../services/permissions-service';
import { SESSION_USER_STATE_MOCK, SessionService } from '../../services/session-service';
import { PAGES_ROUTING_PATHS } from '../../pages/routing/constants/routing-paths.constant';
import { ROUTE_PERMISSIONS_MOCK } from './mocks/route-permissions.mock';

async function runRoutePermissionGuard(
  guard: typeof routePermissionsGuard,
  guardParameters: number | null,
  urlPath: string,
) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];

  dummyRoute.data = { routePermissionId: guardParameters };

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
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/manual-account-creation';

  beforeEach(() => {
    mockPermissionsService = jasmine.createSpyObj(routePermissionsGuard, ['getUniquePermissions']);

    mockSessionService = jasmine.createSpyObj(routePermissionsGuard, ['getUserState']);
    mockSessionService.getUserState.and.returnValue(of(SESSION_USER_STATE_MOCK));

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
          provide: SessionService,
          useValue: mockSessionService,
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
    mockSessionService.getUserState.and.returnValue(throwError(() => 'Error'));
    const guard = await runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS_MOCK['test-route'], urlPath);
    expect(guard).toBeFalsy();
  }));
});
