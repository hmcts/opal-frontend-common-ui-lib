import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OpalUserService } from './opal-user.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { IOpalUserBusinessUnitUser } from './interfaces/opal-user-business-unit-user.interface';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

interface IOpalUserStateResponse {
  user_id: number;
  username: string;
  name: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED' | null;
  version: number | null;
  cache_name: string | null;
  domains: Record<string, { business_unit_users: IOpalUserBusinessUnitUser[] } | undefined>;
}

const USER_STATE_DOMAIN = 'configured-domain';
const ALTERNATIVE_USER_STATE_DOMAIN = 'alternative-domain';

const USER_STATE_MOCK: IOpalUserStateResponse = {
  user_id: 50000000,
  username: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
  status: 'ACTIVE',
  version: 1,
  cache_name: 'user_state_test-user-id',
  domains: {
    [USER_STATE_DOMAIN]: {
      business_unit_users: [
        {
          business_unit_user_id: 'L017KG',
          business_unit_id: 17,
          permissions: [
            {
              permission_id: 54,
              permission_name: 'Account Enquiry',
            },
          ],
        },
      ],
    },
    [ALTERNATIVE_USER_STATE_DOMAIN]: {
      business_unit_users: [
        {
          business_unit_user_id: 'C017KG',
          business_unit_id: 17,
          permissions: [
            {
              permission_id: 88,
              permission_name: 'Confiscation Permission',
            },
          ],
        },
      ],
    },
  },
};

const OPAL_USER_STATE_MOCK: IOpalUserState = {
  user_id: USER_STATE_MOCK.user_id,
  username: USER_STATE_MOCK.username,
  name: USER_STATE_MOCK.name,
  status: 'active',
  version: USER_STATE_MOCK.version,
  business_unit_users: USER_STATE_MOCK.domains[USER_STATE_DOMAIN]?.business_unit_users ?? [],
};

describe('OpalUserService', () => {
  let service: OpalUserService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;

  function setupTestBed(userStateDomain?: string): void {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpalUserService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);

    service.clearUserStateCache();

    if (userStateDomain) {
      globalStore.setUserStateDomain(userStateDomain);
    }
  }

  beforeEach(() => {
    setupTestBed(USER_STATE_DOMAIN);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get the logged-in user state from the frontend user-state endpoint', () => {
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
      expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush(USER_STATE_MOCK);
  });

  it('should request fresh user state on each call', () => {
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should error when the response does not include the configured user-state domain', () => {
    const userStateWithoutConfiguredDomain: IOpalUserStateResponse = {
      ...USER_STATE_MOCK,
      domains: {},
    };

    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected missing configured user-state domain to throw'),
      error: (error: Error) => {
        expect(error.message).toBe(`User state response does not include required domain '${USER_STATE_DOMAIN}'.`);
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(userStateWithoutConfiguredDomain);
  });

  it('should map business_unit_users from the configured user-state domain', () => {
    globalStore.setUserStateDomain(ALTERNATIVE_USER_STATE_DOMAIN);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response.business_unit_users).toEqual(
        USER_STATE_MOCK.domains[ALTERNATIVE_USER_STATE_DOMAIN]?.business_unit_users,
      );
      expect(globalStore.userState().business_unit_users).toEqual(
        USER_STATE_MOCK.domains[ALTERNATIVE_USER_STATE_DOMAIN]?.business_unit_users,
      );
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should error when no user-state domain is configured', () => {
    TestBed.resetTestingModule();
    setupTestBed();

    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected missing user-state domain to throw'),
      error: (error: Error) => {
        expect(error.message).toBe('User state domain is required before loading user permissions.');
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should error when the configured user-state domain is blank', () => {
    globalStore.setUserStateDomain('   ');

    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected blank user-state domain to throw'),
      error: (error: Error) => {
        expect(error.message).toBe('User state domain is required before loading user permissions.');
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it.each([
    ['ACTIVE', 'active'],
    ['PENDING', 'created'],
    ['SUSPENDED', 'suspended'],
    ['DEACTIVATED', 'deactivated'],
    [null, null],
  ] as const)('should map the user state status %s to %s', (apiStatus, expectedStatus) => {
    service.getLoggedInUserState().subscribe((response) => {
      expect(response.status).toBe(expectedStatus);
      expect(globalStore.userState().status).toBe(expectedStatus);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush({
      ...USER_STATE_MOCK,
      status: apiStatus,
    });
  });

  it('should clear the global store user state when clearUserStateCache is called', () => {
    globalStore.setUserState(OPAL_USER_STATE_MOCK);

    service.clearUserStateCache();

    expect(globalStore.userState()).toEqual({} as IOpalUserState);
  });

  it('should clear the global store and fetch fresh data when refreshUserState is called', () => {
    globalStore.setUserState(OPAL_USER_STATE_MOCK);

    service.refreshUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
      expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);
    });

    expect(globalStore.userState()).toEqual({} as IOpalUserState);

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });
});
