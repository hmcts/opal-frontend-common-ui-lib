import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_PATHS } from '@hmcts/opal-frontend-common/services/opal-user-service/constants';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks/opal-user-state-response.mock';
import { USER_STATE_DOMAIN_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks/user-state-domain.mock';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;
  let opalUserService: OpalUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    globalStore = TestBed.inject(GlobalStore);
    opalUserService = TestBed.inject(OpalUserService);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    opalUserService.clearUserStateCache();
    globalStore.setUserStateDomain(USER_STATE_DOMAIN_MOCK);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(true);
      expect(globalStore.authenticated()).toEqual(true);
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should be not authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(false);
      expect(globalStore.authenticated()).toEqual(false);
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(false);
  });

  it('should make a GET request to check authentication and set authenticated state to false on error', () => {
    service.checkAuthenticated().subscribe(
      () => {},
      () => {
        expect(globalStore.authenticated()).toEqual(false);
      },
    );

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush('401 error', { status: 401, statusText: 'Not Authenticated' });
  });

  it('should end the session and clear the authenticated state on logout', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(OPAL_USER_STATE_MOCK);

    service.logout().subscribe(() => {
      expect(globalStore.authenticated()).toEqual(false);
      expect(globalStore.userState()).toEqual({} as IOpalUserState);
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.logout}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('');
  });

  it('should invalidate cached user state when logout starts', () => {
    opalUserService.getLoggedInUserState().subscribe();
    const cachedUserStateRequest = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    cachedUserStateRequest.flush(USER_STATE_MOCK);

    service.logout().subscribe();
    const logoutRequest = httpMock.expectOne(SSO_ENDPOINTS.logout);
    logoutRequest.flush('');

    opalUserService.getLoggedInUserState().subscribe();

    const freshUserStateRequest = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    freshUserStateRequest.flush(USER_STATE_MOCK);
  });

  it('should invalidate cached and pending user state when logout starts', () => {
    const responses: IOpalUserState[] = [];

    opalUserService.getLoggedInUserState().subscribe((response) => responses.push(response));
    const staleUserStateRequest = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    service.logout().subscribe();
    const logoutRequest = httpMock.expectOne(SSO_ENDPOINTS.logout);
    logoutRequest.flush('');

    expect(globalStore.userState()).toEqual({} as IOpalUserState);

    opalUserService.getLoggedInUserState().subscribe((response) => responses.push(response));
    const freshUserStateRequest = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);

    staleUserStateRequest.flush(USER_STATE_MOCK);

    expect(globalStore.userState()).toEqual({} as IOpalUserState);
    expect(responses).toEqual([]);

    freshUserStateRequest.flush(USER_STATE_MOCK);

    expect(globalStore.userState()).toEqual(OPAL_USER_STATE_MOCK);
    expect(responses).toEqual([OPAL_USER_STATE_MOCK]);
  });

  it('should clear the authenticated state when logout fails', () => {
    globalStore.setAuthenticated(true);

    service.logout().subscribe({
      error: () => {
        expect(globalStore.authenticated()).toEqual(false);
      },
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.logout}`);
    req.flush('Service unavailable', { status: 503, statusText: 'Service Unavailable' });
  });
});
