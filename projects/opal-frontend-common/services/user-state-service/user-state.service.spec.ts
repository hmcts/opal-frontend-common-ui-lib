import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STATE_ENDPOINTS } from './constants/user-state-endpoints.constant';
import { IUserState } from './interfaces/user-state.interface';
import { UserStateService } from './user-state.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';

const USER_STATE_MOCK: IUserState = {
  user_id: 12345,
  username: 'test-user',
  name: 'Test User',
  status: 'ACTIVE',
  version: 1,
  cache_name: 'user_state_test-user-id',
  domains: {
    fines: {
      business_unit_users: [
        {
          business_unit_user_id: 'L017KG',
          business_unit_id: 17,
          permissions: [
            {
              permission_id: 1,
              permission_name: 'Account Enquiry',
            },
          ],
        },
      ],
    },
  },
};

describe('UserStateService', () => {
  let service: UserStateService;
  let globalStore: GlobalStoreType;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserStateService);
    globalStore = TestBed.inject(GlobalStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get the user state from the frontend API endpoint', () => {
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(USER_STATE_MOCK);
    });

    const req = httpMock.expectOne(USER_STATE_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(USER_STATE_MOCK);
  });

  it('should update the global store with user permissions from the fines domain', () => {
    service.getUserState().subscribe();

    const req = httpMock.expectOne(USER_STATE_ENDPOINTS.userState);
    req.flush(USER_STATE_MOCK);

    expect(globalStore.userState()).toEqual({
      user_id: USER_STATE_MOCK.user_id,
      username: USER_STATE_MOCK.username,
      name: USER_STATE_MOCK.name,
      status: USER_STATE_MOCK.status,
      version: USER_STATE_MOCK.version,
      business_unit_users: USER_STATE_MOCK.domains.fines?.business_unit_users,
    });
  });

  it('should request user state on each call', () => {
    service.getUserState().subscribe();

    let req = httpMock.expectOne(USER_STATE_ENDPOINTS.userState);
    req.flush(USER_STATE_MOCK);

    service.getUserState().subscribe();

    req = httpMock.expectOne(USER_STATE_ENDPOINTS.userState);
    req.flush(USER_STATE_MOCK);
  });
});
