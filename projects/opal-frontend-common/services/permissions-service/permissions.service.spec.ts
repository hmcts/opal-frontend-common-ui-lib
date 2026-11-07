import { TestBed } from '@angular/core/testing';
import { PermissionsService } from './permissions.service';
import { OPAL_USER_STATE_MOCK } from '../opal-user-service/mocks/opal-user-state.mock';
import { describe, beforeEach, it, expect } from 'vitest';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return unique permission codes', () => {
    const unique = service.getUniquePermissions(OPAL_USER_STATE_MOCK);
    expect(unique).toEqual(['ACCOUNT_ENQUIRY', 'ACCOUNT_ENQUIRY_NOTES']);
  });

  it('should recalculate unique permission codes for each user state', () => {
    const firstUnique = service.getUniquePermissions(OPAL_USER_STATE_MOCK);
    const secondUnique = service.getUniquePermissions({
      ...OPAL_USER_STATE_MOCK,
      business_unit_users: [
        {
          business_unit_user_id: 'L017KG',
          business_unit_id: 17,
          permissions: [
            {
              permission_code: 'UPDATED_PERMISSION',
              permission_name: 'Updated permission',
            },
          ],
        },
      ],
    });

    expect(firstUnique).toEqual(['ACCOUNT_ENQUIRY', 'ACCOUNT_ENQUIRY_NOTES']);
    expect(secondUnique).toEqual(['UPDATED_PERMISSION']);
  });

  it('should return permission access - hasBusinessUnitPermissionAccess', () => {
    const hasPermissionAccess = service.hasBusinessUnitPermissionAccess(
      'ACCOUNT_ENQUIRY',
      17,
      OPAL_USER_STATE_MOCK['business_unit_users'],
    );
    expect(hasPermissionAccess).toBe(true);
  });

  it('should not return permission access - hasBusinessUnitPermissionAccess', () => {
    const hasPermissionAccess = service.hasBusinessUnitPermissionAccess(
      'ACCOUNT_ENQUIRY',
      999,
      OPAL_USER_STATE_MOCK['business_unit_users'],
    );
    expect(hasPermissionAccess).toBe(false);
  });

  it('should return true when no roles are provided - hasBusinessUnitPermissionAccess', () => {
    const result = service.hasBusinessUnitPermissionAccess('ACCOUNT_ENQUIRY', 1, []);
    expect(result).toBe(true);
  });

  it('should return permission access - hasPermissionAccess', () => {
    const hasPermissionAccess = service.hasPermissionAccess(
      'ACCOUNT_ENQUIRY',
      OPAL_USER_STATE_MOCK['business_unit_users'],
    );
    expect(hasPermissionAccess).toBe(true);
  });

  it('should not return permission access - hasPermissionAccess', () => {
    const hasPermissionAccess = service.hasPermissionAccess(
      'UNKNOWN_PERMISSION',
      OPAL_USER_STATE_MOCK['business_unit_users'],
    );
    expect(hasPermissionAccess).toBe(false);
  });

  it('should return true when no roles are provided - hasPermissionAccess', () => {
    const result = service.hasPermissionAccess('ACCOUNT_ENQUIRY', []);
    expect(result).toBe(true);
  });

  it('should return [] when userState is null', () => {
    const unique = service.getUniquePermissions(null);
    expect(unique).toEqual([]);
  });

  it('should deduplicate permission codes across business units regardless of display names', () => {
    const role = OPAL_USER_STATE_MOCK.business_unit_users[0];
    const userState = {
      ...OPAL_USER_STATE_MOCK,
      business_unit_users: [
        role,
        {
          ...role,
          business_unit_id: 99,
          permissions: role.permissions.map((permission) => ({ ...permission, permission_name: 'Renamed permission' })),
        },
      ],
    };

    expect(service.getUniquePermissions(userState)).toEqual(['ACCOUNT_ENQUIRY', 'ACCOUNT_ENQUIRY_NOTES']);
  });

  it('should authorize by code even when its display name changes', () => {
    const roles = [
      {
        business_unit_user_id: 'TEST_BU_USER',
        business_unit_id: 17,
        permissions: [{ permission_code: 'ACCOUNT_ENQUIRY', permission_name: 'Renamed permission' }],
      },
    ];

    expect(service.hasPermissionAccess('ACCOUNT_ENQUIRY', roles)).toBe(true);
    expect(service.hasBusinessUnitPermissionAccess('ACCOUNT_ENQUIRY', 17, roles)).toBe(true);
  });

  it('should not authorize a different code with a matching display name', () => {
    const roles = [
      {
        business_unit_user_id: 'TEST_BU_USER',
        business_unit_id: 17,
        permissions: [{ permission_code: 'OTHER_PERMISSION', permission_name: 'ACCOUNT_ENQUIRY' }],
      },
    ];

    expect(service.hasPermissionAccess('ACCOUNT_ENQUIRY', roles)).toBe(false);
    expect(service.hasBusinessUnitPermissionAccess('ACCOUNT_ENQUIRY', 17, roles)).toBe(false);
  });

  it('should not use a permission from a different business unit', () => {
    const roles = [
      { business_unit_user_id: 'BU_17', business_unit_id: 17, permissions: [] },
      {
        business_unit_user_id: 'BU_99',
        business_unit_id: 99,
        permissions: [{ permission_code: 'ACCOUNT_ENQUIRY', permission_name: 'Account Enquiry' }],
      },
    ];

    expect(service.hasPermissionAccess('ACCOUNT_ENQUIRY', roles)).toBe(true);
    expect(service.hasBusinessUnitPermissionAccess('ACCOUNT_ENQUIRY', 17, roles)).toBe(false);
    expect(service.hasBusinessUnitPermissionAccess('ACCOUNT_ENQUIRY', 99, roles)).toBe(true);
  });
});
