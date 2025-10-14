import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OpalUserService } from './opal-user.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from './mocks/opal-user-state.mock';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';

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
  });

  it('should return the user state', () => {
    const mockUserState: IOpalUserState = OPAL_USER_STATE_MOCK;

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should call addUser when logged in user state returns 404', () => {
    const createdUserState: IOpalUserState = {
      ...OPAL_USER_STATE_MOCK,
      user_id: 123456789,
    };

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(createdUserState);
      expect(globalStore.userState()).toEqual(createdUserState);
    });

    const getReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(getReq.request.method).toBe('GET');
    getReq.flush('Not found', { status: 404, statusText: 'Not Found' });

    const postReq = httpMock.expectOne(OPAL_USER_PATHS.addUser);
    expect(postReq.request.method).toBe('POST');
    postReq.flush(createdUserState);
  });

  it('should call updateUser when logged in user state returns 409', () => {
    const updatedUserState: IOpalUserState = {
      ...OPAL_USER_STATE_MOCK,
      user_id: 987654321,
    };

    service.getLoggedInUserState().subscribe((response) => {
      expect(response).toEqual(updatedUserState);
      expect(globalStore.userState()).toEqual(updatedUserState);
    });

    const getReq = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(getReq.request.method).toBe('GET');
    getReq.flush('Conflict', { status: 409, statusText: 'Conflict' });

    const putReq = httpMock.expectOne(OPAL_USER_PATHS.updateUser);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush(updatedUserState);
  });

  it('should rethrow unexpected errors from getLoggedInUserState', () => {
    const unexpectedStatus = 500;

    service.getLoggedInUserState().subscribe({
      next: () => fail('Expected observable to error for unexpected status'),
      error: (error) => {
        expect(error.status).toBe(unexpectedStatus);
      },
    });

    const req = httpMock.expectOne(OPAL_USER_PATHS.loggedInUserState);
    expect(req.request.method).toBe('GET');
    req.flush('Server error', { status: unexpectedStatus, statusText: 'Server Error' });
  });
});
