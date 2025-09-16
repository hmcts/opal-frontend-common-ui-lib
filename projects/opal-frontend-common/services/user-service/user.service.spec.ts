import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserService } from './user.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IUserState } from './interfaces/user-state.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { USER_STATE_MOCK } from './mocks/user-state.mock';
import { USER_ENDPOINTS } from './constants/user-endpoints.constant';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStore = TestBed.inject(GlobalStore);
  });

  it('should return the user state', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStore.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(USER_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should error on malformed id type and not update the store', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const malformed = { ...(USER_STATE_MOCK as unknown as Record<string, any>), user_id: '500000000' };

    let captured: unknown;
    service.getUserState().subscribe({
      next: () => fail('expected error'),
      error: (e) => (captured = e),
    });

    const req = httpMock.expectOne(USER_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    // flush a structurally invalid payload (string id instead of number)
    req.flush(malformed);

    // The service validates and throws Error('Invalid user state payload')
    expect(captured instanceof Error && (captured as Error).message === 'Invalid user state payload').toBeTrue();

    // Store must not be updated on validation error
    expect(globalStore.userState()).toEqual({} as IUserState);
  });

  it('should retry failed requests up to MAX_RETRIES and then succeed', fakeAsync(() => {
    let result: IUserState | undefined;
    service.getUserState().subscribe((r) => (result = r));

    // 1st, 2nd, 3rd attempts -> 500
    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't1' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't2' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't3' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    // 4th attempt succeeds
    const final = httpMock.expectOne(USER_ENDPOINTS.userState);
    final.flush(USER_STATE_MOCK);

    expect(result).toEqual(USER_STATE_MOCK);
    expect(globalStore.userState()).toEqual(USER_STATE_MOCK);
  }));

  it('should clear store and propagate error on 401', fakeAsync(() => {
    // seed store so we can observe it being cleared
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalStore as any).setUserState(USER_STATE_MOCK);

    let captured: HttpErrorResponse | undefined;
    service.getUserState().subscribe({
      next: () => fail('expected error'),
      error: (e) => (captured = e),
    });

    // 1st, 2nd, 3rd attempts -> 401
    httpMock
      .expectOne(USER_ENDPOINTS.userState)
      .flush({ error: 'unauth-1' }, { status: 401, statusText: 'Unauthorized' });
    tick(10_000);

    httpMock
      .expectOne(USER_ENDPOINTS.userState)
      .flush({ error: 'unauth-2' }, { status: 401, statusText: 'Unauthorized' });
    tick(10_000);

    httpMock
      .expectOne(USER_ENDPOINTS.userState)
      .flush({ error: 'unauth-3' }, { status: 401, statusText: 'Unauthorized' });
    tick(10_000);

    // final (4th) attempt -> 401 triggers catchError
    httpMock
      .expectOne(USER_ENDPOINTS.userState)
      .flush({ error: 'unauth-final' }, { status: 401, statusText: 'Unauthorized' });

    expect(captured?.status).toBe(401);
    // store cleared: implementation returns falsy (often `{}`), don't assert strict undefined
    expect(!!globalStore.userState()).toBeFalse();
  }));

  it('should NOT clear store on non-401 errors and still error', fakeAsync(() => {
    // seed store
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalStore as any).setUserState(USER_STATE_MOCK);

    let captured: HttpErrorResponse | undefined;
    service.getUserState().subscribe({
      next: () => fail('expected error'),
      error: (e) => (captured = e),
    });

    // 1st, 2nd, 3rd attempts -> 500
    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't1' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't2' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 't3' }, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    // final (4th) attempt -> 500 triggers catchError to rethrow
    httpMock.expectOne(USER_ENDPOINTS.userState).flush({ error: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(captured?.status).toBe(500);
    // must remain unchanged
    expect(globalStore.userState()).toEqual(USER_STATE_MOCK);
  }));
});
