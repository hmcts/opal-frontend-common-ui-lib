import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { businessUnitRoutePermissionsGuard, BUSINESS_UNIT_ID_RESOLVER } from './business-unit-route-permissions.guard';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';

function createRoute(routePermissionId?: number[] | number, accessDeniedPath?: string): ActivatedRouteSnapshot {
  const route = new ActivatedRouteSnapshot();
  route.data = {
    ...(routePermissionId === undefined ? {} : { routePermissionId }),
    ...(accessDeniedPath === undefined ? {} : { accessDeniedPath }),
  };
  return route;
}

describe('businessUnitRoutePermissionsGuard', () => {
  let createUrlTreeMock: Mock;
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

  beforeEach(() => {
    createUrlTreeMock = vi.fn().mockName('Router.createUrlTree');
    hasBusinessUnitPermissionAccessMock = vi.fn().mockName('PermissionsService.hasBusinessUnitPermissionAccess');
    getLoggedInUserStateMock = vi.fn().mockName('OpalUserService.getLoggedInUserState');
    resolveBusinessUnitIdMock = vi.fn().mockName('BusinessUnitIdResolver.resolveBusinessUnitId');

    getLoggedInUserStateMock.mockReturnValue(of(userState));
    resolveBusinessUnitIdMock.mockReturnValue(Promise.resolve(123));
    hasBusinessUnitPermissionAccessMock.mockReturnValue(true);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: createUrlTreeMock,
          },
        },
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
  });

  it('should allow access when the route does not require any permissions', async () => {
    const route = createRoute();

    const result = await TestBed.runInInjectionContext(() =>
      businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
    expect(getLoggedInUserStateMock).not.toHaveBeenCalled();
    expect(resolveBusinessUnitIdMock).not.toHaveBeenCalled();
  });

  it('should allow access when the user has the required permission in the resolved business unit', async () => {
    const route = createRoute([77]);

    const result = await TestBed.runInInjectionContext(() =>
      businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
    expect(getLoggedInUserStateMock).toHaveBeenCalledTimes(1);
    expect(resolveBusinessUnitIdMock).toHaveBeenCalledWith(route);
    expect(hasBusinessUnitPermissionAccessMock).toHaveBeenCalledWith(77, 123, userState.business_unit_users);
  });

  it('should redirect to the configured access denied path when the user lacks the required permission', async () => {
    const expectedUrlTree = new UrlTree();
    hasBusinessUnitPermissionAccessMock.mockReturnValue(false);
    createUrlTreeMock.mockReturnValue(expectedUrlTree);
    const route = createRoute([77], '/custom-denied');

    const result = await TestBed.runInInjectionContext(() =>
      businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(expectedUrlTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/custom-denied']);
  });

  it('should redirect when the resolver cannot determine the business unit', async () => {
    const expectedUrlTree = new UrlTree();
    resolveBusinessUnitIdMock.mockResolvedValueOnce(null);
    createUrlTreeMock.mockReturnValue(expectedUrlTree);
    const route = createRoute([77], '/custom-denied');

    const result = await TestBed.runInInjectionContext(() =>
      businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(expectedUrlTree);
    expect(hasBusinessUnitPermissionAccessMock).not.toHaveBeenCalled();
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/custom-denied']);
  });

  it('should redirect when the user has no business unit roles', async () => {
    const expectedUrlTree = new UrlTree();
    getLoggedInUserStateMock.mockReturnValue(of({ business_unit_users: [] }));
    createUrlTreeMock.mockReturnValue(expectedUrlTree);
    const route = createRoute([77]);

    const result = await TestBed.runInInjectionContext(() =>
      businessUnitRoutePermissionsGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(expectedUrlTree);
    expect(resolveBusinessUnitIdMock).not.toHaveBeenCalled();
    expect(hasBusinessUnitPermissionAccessMock).not.toHaveBeenCalled();
    expect(createUrlTreeMock).toHaveBeenCalledWith([`/${'access-denied'}`]);
  });
});
