import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { SESSION_TOKEN_EXPIRY_MOCK } from './mocks/session-token-expiry.mock';
import { SessionService } from './session.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SESSION_ENDPOINTS } from '@hmcts/opal-frontend-common/services/session-service/constants';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

const mockTokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);
  });

  beforeEach(() => {
    globalStore.setTokenExpiry(mockTokenExpiry);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the token expiry information', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStore.tokenExpiry()).toEqual(mockTokenExpiry);
    });

    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);
  });

  it('should return cached response', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStore.tokenExpiry()).toEqual(mockTokenExpiry);
    });
    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);
    // Make a second call
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStore.tokenExpiry()).toEqual(mockTokenExpiry);
    });
    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.expiry);
  });

  it('should do a new request if the cached response is empty', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStore.tokenExpiry()).toEqual(mockTokenExpiry);
    });
    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);

    // Make a second call
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStore.tokenExpiry()).toEqual(mockTokenExpiry);
    });
    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.expiry);
  });

  it('should retry the request exactly 5 times before success', () => {
    vi.useFakeTimers();

    let responseReceived = false;

    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      responseReceived = true;
    });

    // Fail the first 4 requests
    for (let i = 0; i < 4; i++) {
      const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      // Advance timers by the retry delay
      vi.advanceTimersByTime(1000);
    }

    // The 5th attempt (after 4 retries) should succeed
    const finalReq = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(finalReq.request.method).toBe('GET');
    finalReq.flush(mockTokenExpiry);

    expect(responseReceived).toBe(true);

    vi.useRealTimers();
  });
});
