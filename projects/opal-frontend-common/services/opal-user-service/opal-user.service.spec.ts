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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const USER_STATE_CACHE_TTL_HEADER = 'X-OPAL-User-State-Cache-TTL-Ms';

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
    vi.restoreAllMocks();
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

  it('should return the cached global store user state on a second call within the TTL', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
  });

  it('should request fresh user state after the local cache expires', () => {
    globalStore.setUserStateCacheExpirationMilliseconds(100);
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);

    vi.mocked(Date.now).mockReturnValue(1_101);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should share one HTTP request between concurrent logged-in user state calls', () => {
    const responses: IOpalUserState[] = [];

    service.getLoggedInUserState().subscribe((response) => responses.push(response));
    service.getLoggedInUserState().subscribe((response) => responses.push(response));

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);

    expect(responses).toEqual([OPAL_USER_STATE_MOCK, OPAL_USER_STATE_MOCK]);
  });

  it('should ignore an in-flight user state response after the cache is cleared', () => {
    const responses: IOpalUserState[] = [];

    service.getLoggedInUserState().subscribe((response) => responses.push(response));
    const staleReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    service.clearUserStateCache();

    service.getLoggedInUserState().subscribe((response) => responses.push(response));
    const freshReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    staleReq.flush(USER_STATE_MOCK);

    expect(globalStore.userState()).toEqual({} as IOpalUserState);
    expect(responses).toEqual([]);

    service.getLoggedInUserState().subscribe((response) => responses.push(response));
    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);

    freshReq.flush(USER_STATE_MOCK);

    expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);
    expect(responses).toEqual([OPAL_USER_STATE_MOCK, OPAL_USER_STATE_MOCK]);
  });

  it('should not clear a newer cache expiry when a stale in-flight user state request fails', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected stale request to be filtered before emitting'),
      error: () => undefined,
    });
    const staleReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    service.clearUserStateCache();

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });
    const freshReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    freshReq.flush(USER_STATE_MOCK);

    staleReq.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
  });

  it('should bypass a valid cached user state when refreshUserState is called', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe();
    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);

    service.refreshUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should not cache a failed user state request', () => {
    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected user state request to fail'),
      error: () => expect(globalStore.userState()).toEqual({} as IOpalUserState),
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should cap the response TTL header by the configured TTL', () => {
    globalStore.setUserStateCacheExpirationMilliseconds(100);
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK, { headers: { [USER_STATE_CACHE_TTL_HEADER]: '1000' } });

    vi.mocked(Date.now).mockReturnValue(1_099);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);

    vi.mocked(Date.now).mockReturnValue(1_101);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it('should expire the local cache immediately when the response TTL header is zero', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK, { headers: { [USER_STATE_CACHE_TTL_HEADER]: '0' } });

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });

  it.each([
    ['missing', undefined],
    ['invalid', 'invalid'],
  ])('should fall back to the configured TTL when the response TTL header is %s', (_, responseTtlHeader) => {
    globalStore.setUserStateCacheExpirationMilliseconds(100);
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    if (responseTtlHeader) {
      req.flush(USER_STATE_MOCK, { headers: { [USER_STATE_CACHE_TTL_HEADER]: responseTtlHeader } });
    } else {
      req.flush(USER_STATE_MOCK);
    }

    vi.mocked(Date.now).mockReturnValue(1_099);

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
    });

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);

    vi.mocked(Date.now).mockReturnValue(1_101);

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

  it('should error when the user-state response body is empty', () => {
    service.getLoggedInUserState().subscribe({
      next: () => expect.fail('Expected empty user-state response body to throw'),
      error: (error: Error) => {
        expect(error.message).toBe('User state response body is required.');
        expect(globalStore.userState()).toEqual({} as IOpalUserState);
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(null);
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

  it('should fetch fresh data when refreshUserState is called without clearing the global store first', () => {
    globalStore.setUserState(OPAL_USER_STATE_MOCK);

    service.refreshUserState().subscribe((response) => {
      expect(response).toEqual(OPAL_USER_STATE_MOCK);
      expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);
    });

    expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(USER_STATE_MOCK);
  });
});
