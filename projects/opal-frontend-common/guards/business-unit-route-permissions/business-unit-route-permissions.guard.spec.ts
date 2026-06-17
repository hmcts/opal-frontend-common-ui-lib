import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  type Routes,
  UrlTree,
} from '@angular/router';
import { of } from 'rxjs';
import { businessUnitRoutePermissionsGuard, BUSINESS_UNIT_ID_RESOLVER } from './business-unit-route-permissions.guard';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRouteComponent {}

function createRoute(routePermissionId?: number[] | number, accessDeniedPath?: string): ActivatedRouteSnapshot {
  const route = new ActivatedRouteSnapshot();
  route.data = {
    ...(routePermissionId === undefined ? {} : { routePermissionId }),
    ...(accessDeniedPath === undefined ? {} : { accessDeniedPath }),
  };
  return route;
}

describe('businessUnitRoutePermissionsGuard', () => {
  let router: Router;
  let hasBusinessUnitPermissionAccessMock: ReturnType<typeof vi.fn>;
  let getLoggedInUserStateMock: ReturnType<typeof vi.fn>;
  let resolveBusinessUnitIdMock: ReturnType<typeof vi.fn>;

  const userState = {
    business_unit_users: [
      {
        business_unit_user_id: 'BU-123',
        business_unit_id: 123,
        permissions: [{ permission_id: 77, permission_name: 'Account Maintenance' }],
      },
    ],
  };

  const accountRoutes: Routes = [
    {
      path: 'fines/account/defendant/:accountId',
      children: [
        {
          path: 'payment-terms/amend',
          component: TestRouteComponent,
          data: {
            routePermissionId: [77],
            accessDeniedPath: 'payment-terms/denied/permission',
          },
        },
        {
          path: 'payment-terms/denied/:type',
          component: TestRouteComponent,
        },
      ],
    },
  ];

  const runGuard = (route: ActivatedRouteSnapshot) =>
    TestBed.runInInjectionContext(() => businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot));

  const getActiveRoute = async (url: string): Promise<ActivatedRouteSnapshot> => {
    await router.navigateByUrl(url);

    let activeRoute = router.routerState.snapshot.root;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  };

  beforeEach(() => {
    hasBusinessUnitPermissionAccessMock = vi.fn().mockName('PermissionsService.hasBusinessUnitPermissionAccess');
    getLoggedInUserStateMock = vi.fn().mockName('OpalUserService.getLoggedInUserState');
    resolveBusinessUnitIdMock = vi.fn().mockName('BusinessUnitIdResolver.resolveBusinessUnitId');

    getLoggedInUserStateMock.mockReturnValue(of(userState));
    resolveBusinessUnitIdMock.mockReturnValue(Promise.resolve(123));
    hasBusinessUnitPermissionAccessMock.mockReturnValue(true);

    TestBed.configureTestingModule({
      providers: [
        provideRouter(accountRoutes),
        {
          provide: PermissionsService,
          useValue: {
            hasBusinessUnitPermissionAccess: hasBusinessUnitPermissionAccessMock,
          },
        },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: getLoggedInUserStateMock,
          },
        },
        {
          provide: BUSINESS_UNIT_ID_RESOLVER,
          useValue: {
            resolveBusinessUnitId: resolveBusinessUnitIdMock,
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access when the route does not require any permissions', async () => {
    const route = createRoute();

    const result = await runGuard(route);

    expect(result).toBe(true);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
    expect(resolveBusinessUnitIdMock).not.toHaveBeenCalled();
  });

  it('should allow access when the user has the required permission in the resolved business unit', async () => {
    const route = createRoute([77]);

    const result = await runGuard(route);

    expect(result).toBe(true);
    expect(getLoggedInUserStateMock).toHaveBeenCalledTimes(1);
    expect(resolveBusinessUnitIdMock).toHaveBeenCalledWith(route);
    expect(hasBusinessUnitPermissionAccessMock).toHaveBeenCalledWith(77, 123, userState.business_unit_users);
  });

  it('should allow access when the business unit resolver returns an observable', async () => {
    resolveBusinessUnitIdMock.mockReturnValue(of(123));
    const route = createRoute([77]);

    const result = await runGuard(route);

    expect(result).toBe(true);
    expect(hasBusinessUnitPermissionAccessMock).toHaveBeenCalledWith(77, 123, userState.business_unit_users);
  });

  it('should redirect to the configured access denied path when the user lacks the required permission', async () => {
    hasBusinessUnitPermissionAccessMock.mockReturnValue(false);
    const route = createRoute([77], '/custom-denied');

    const result = await runGuard(route);

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/custom-denied');
  });

  it('should redirect to an account-scoped access denied path when the configured path is relative', async () => {
    hasBusinessUnitPermissionAccessMock.mockReturnValue(false);
    const route = await getActiveRoute('/fines/account/defendant/12345678/payment-terms/amend');

    const result = await runGuard(route);

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe(
      '/fines/account/defendant/12345678/payment-terms/denied/permission',
    );
  });

  it('should redirect when the resolver cannot determine the business unit', async () => {
    resolveBusinessUnitIdMock.mockResolvedValueOnce(null);
    const route = createRoute([77], '/custom-denied');

    const result = await runGuard(route);

    expect(result).toBeInstanceOf(UrlTree);
    expect(hasBusinessUnitPermissionAccessMock).not.toHaveBeenCalled();
    expect(router.serializeUrl(result as UrlTree)).toBe('/custom-denied');
  });

  it('should redirect when the user has no business unit roles', async () => {
    getLoggedInUserStateMock.mockReturnValue(of({ business_unit_users: [] }));
    const route = createRoute([77]);

    const result = await runGuard(route);

    expect(result).toBeInstanceOf(UrlTree);
    expect(resolveBusinessUnitIdMock).not.toHaveBeenCalled();
    expect(hasBusinessUnitPermissionAccessMock).not.toHaveBeenCalled();
    expect(router.serializeUrl(result as UrlTree)).toBe('/access-denied');
  });
});
