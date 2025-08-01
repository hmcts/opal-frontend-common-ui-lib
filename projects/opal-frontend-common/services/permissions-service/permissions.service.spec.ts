import { TestBed } from '@angular/core/testing';
import { PermissionsService } from './permissions.service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return unique permission IDs', () => {
    service.getUniquePermissions(SESSION_USER_STATE_MOCK);
    expect(service['storedUniquePermissionIds']).toEqual([54, 41]);
  });

  it('should return permission access - hasBusinessUnitPermissionAccess', () => {
    const hasPermissionAccess = service.hasBusinessUnitPermissionAccess(
      54,
      17,
      SESSION_USER_STATE_MOCK['business_unit_user'],
    );
    expect(hasPermissionAccess).toBeTrue();
  });

  it('should not return permission access - hasBusinessUnitPermissionAccess', () => {
    const hasPermissionAccess = service.hasBusinessUnitPermissionAccess(
      54,
      99,
      SESSION_USER_STATE_MOCK['business_unit_user'],
    );
    expect(hasPermissionAccess).toBeFalse();
  });

  it('should return true when no roles are provided - hasBusinessUnitPermissionAccess', () => {
    const result = service.hasBusinessUnitPermissionAccess(1, 1, []);
    expect(result).toBeTrue();
  });

  it('should return permission access - hasPermissionAccess', () => {
    const hasPermissionAccess = service.hasPermissionAccess(54, SESSION_USER_STATE_MOCK['business_unit_user']);
    expect(hasPermissionAccess).toBeTrue();
  });

  it('should not return permission access - hasPermissionAccess', () => {
    const hasPermissionAccess = service.hasPermissionAccess(0, SESSION_USER_STATE_MOCK['business_unit_user']);
    expect(hasPermissionAccess).toBeFalse();
  });

  it('should return true when no roles are provided - hasPermissionAccess', () => {
    const result = service.hasPermissionAccess(1, []);
    expect(result).toBeTrue();
  });
});
