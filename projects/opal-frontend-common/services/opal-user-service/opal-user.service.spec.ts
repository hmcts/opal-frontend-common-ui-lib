import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OpalUserService } from './opal-user.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { OPAL_USER_STATE_RESPONSE_STATUS } from './constants/opal-user-state-response-status.constant';
import { IOpalUserStateResponse } from './interfaces/opal-user-state-response.interface';
import { ALTERNATIVE_USER_STATE_DOMAIN_MOCK } from './mocks/alternative-user-state-domain.mock';
import { OPAL_USER_STATE_MOCK } from './mocks/opal-user-state.mock';
import { USER_STATE_MOCK } from './mocks/opal-user-state-response.mock';
import { USER_STATE_DOMAIN_MOCK } from './mocks/user-state-domain.mock';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('OpalUserService', () => {
  let service: OpalUserService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpalUserService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);

    service.clearUserStateCache();
    globalStore.setUserStateDomain(USER_STATE_DOMAIN_MOCK);
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
        expect(error.message).toBe(`User state response does not include required domain '${USER_STATE_DOMAIN_MOCK}'.`);
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(userStateWithoutConfiguredDomain);
  });

  it('should map business_unit_users from the configured user-state domain', () => {
    globalStore.setUserStateDomain(ALTERNATIVE_USER_STATE_DOMAIN_MOCK);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response.business_unit_users).toEqual(
        USER_STATE_MOCK.domains[ALTERNATIVE_USER_STATE_DOMAIN_MOCK]?.business_unit_users,
      );
      expect(globalStore.userState().business_unit_users).toEqual(
        USER_STATE_MOCK.domains[ALTERNATIVE_USER_STATE_DOMAIN_MOCK]?.business_unit_users,
      );
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should error when no user-state domain is configured', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpalUserService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);
    service.clearUserStateCache();

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

  it.each(Object.entries(OPAL_USER_STATE_RESPONSE_STATUS))(
    'should map the user state status %s to %s',
    (apiStatus, expectedStatus) => {
      service.getLoggedInUserState().subscribe((response) => {
        expect(response.status).toBe(expectedStatus);
        expect(globalStore.userState().status).toBe(expectedStatus);
      });

      const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
      req.flush({
        ...USER_STATE_MOCK,
        status: apiStatus,
      });
    },
  );

  it('should map a null user state status to null', () => {
    service.getLoggedInUserState().subscribe((response) => {
      expect(response.status).toBeNull();
      expect(globalStore.userState().status).toBeNull();
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush({
      ...USER_STATE_MOCK,
      status: null,
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
