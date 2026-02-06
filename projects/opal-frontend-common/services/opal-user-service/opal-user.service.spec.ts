import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OpalUserService } from './opal-user.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { IOpalUserStateCached } from './interfaces/opal-user-state-cached.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from './mocks/opal-user-state.mock';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DateTime } from 'luxon';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

describe('OpalUserService', () => {
  let service: OpalUserService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;
  let dateService: DateService;
  const mockUserState: IOpalUserState = OPAL_USER_STATE_MOCK;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpalUserService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);
    dateService = TestBed.inject(DateService);

    service.clearUserStateCache();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return the user state when no cache exists', () => {
    const mockUserState: IOpalUserState = OPAL_USER_STATE_MOCK;

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should fetch from backend when no cache exists', () => {
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);

      // Verify cache was created
      expect(service['userStateCache']).toBeDefined();
      expect(service['userStateCache'].userState).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should use cached data when cache is valid', () => {
    // First call to populate cache
    service.getLoggedInUserState().subscribe();

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);

    // Second call should use cache (no HTTP request)
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);
    });

    // Verify no additional HTTP requests were made
    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
  });

  it('should fetch fresh data when global store user differs from cache', () => {
    // Seed cache with user A and mark as unexpired
    service['userStateCache'] = {
      userState: mockUserState,
      expiryAt: DateTime.now().plus({ minutes: 10 }).toISO(),
    };

    // Simulate global store holding a different user (user B)
    const differentUser: IOpalUserState = { ...mockUserState, user_id: 999 };
    globalStore.setUserState(differentUser);

    // Call should bypass cache and fetch fresh data
    const freshUser: IOpalUserState = { ...mockUserState, user_id: 12345 };
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(freshUser);
      expect(globalStore.userState()).toEqual(freshUser);
      expect(service['userStateCache'].userState).toEqual(freshUser);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush(freshUser);
  });

  it('should fetch fresh data when cache is expired', () => {
    // Mock DateService to simulate expired cache
    const now = DateTime.now();
    const pastTime = now.minus({ minutes: 35 }); // 35 minutes ago
    const expiredTime = now.minus({ minutes: 5 }); // Expired 5 minutes ago

    vi.spyOn(dateService, 'getDateNow').mockReturnValueOnce(pastTime).mockReturnValueOnce(now).mockReturnValueOnce(now);

    vi.spyOn(dateService, 'getFromIso').mockReturnValue(expiredTime);

    // First call to populate cache with expired data
    service.getLoggedInUserState().subscribe();

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);

    // Second call should fetch fresh data due to expired cache
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
    });

    // Should make another HTTP request due to expired cache
    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);
  });

  it('should clear cache and fetch fresh data when refreshUserState is called', () => {
    // First call to populate cache
    service.getLoggedInUserState().subscribe();

    let req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);

    // Verify cache exists
    expect(service['userStateCache'].userState).toEqual(mockUserState);

    // Call refreshUserState
    service.refreshUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
    });

    // Should make a fresh HTTP request
    req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);
  });

  it('should handle different cache expiration times', () => {
    const customExpirationMilliseconds = 60 * 1000; // 60 seconds
    const now = DateTime.now();
    globalStore.setUserStateCacheExpirationMilliseconds(customExpirationMilliseconds);

    vi.spyOn(dateService, 'getDateNow').mockReturnValue(now);

    service.getLoggedInUserState().subscribe();

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);

    // Verify cache was set with correct expiration time
    const cachedData = service['userStateCache'];
    const expectedExpiryTime = now.plus({ milliseconds: customExpirationMilliseconds });

    expect(cachedData.expiryAt).toBe(expectedExpiryTime.toISO());
  });

  it('should update global store when using cached data', () => {
    // First call to populate cache
    service.getLoggedInUserState().subscribe();

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    req.flush(mockUserState);

    // Reset global store
    globalStore.setUserState({} as IOpalUserState);
    expect(globalStore.userState()).toEqual({} as IOpalUserState);

    // Second call should use cache and update global store
    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);
    });

    httpMock.expectNone(OPAL_USER_PATHS.loggedInUserState);
  });

  it('should return true for isCacheExpired when cache does not exist', () => {
    // Ensure cache is cleared
    service.clearUserStateCache();

    // Access the private method to test the uncovered line
    const isExpired = service['isCacheExpired']();
    expect(isExpired).toBe(true);
  });

  it('should return true for isCacheExpired when expiryAt is missing', () => {
    // Set up cache without expiryAt
    service['userStateCache'] = {
      userState: mockUserState,
      expiryAt: '', // Empty expiryAt
    };

    const isExpired = service['isCacheExpired']();
    expect(isExpired).toBe(true);
  });

  it('should return true for isCacheExpired when cache is undefined', () => {
    // Explicitly set cache to undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service['userStateCache'] = undefined as any;

    const isExpired = service['isCacheExpired']();
    expect(isExpired).toBe(true);
  });

  it('should clear cache and reset global store when clearUserStateCache is called', () => {
    service['userStateCache'] = {
      userState: mockUserState,
      expiryAt: DateTime.now().toISO(),
    };
    globalStore.setUserState(mockUserState);

    service.clearUserStateCache();

    expect(service['userStateCache']).toEqual({} as IOpalUserStateCached);
    expect(globalStore.userState()).toEqual({} as IOpalUserState);
  });
});
