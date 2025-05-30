import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { httpErrorInterceptor } from './http-error.interceptor';
import { of, throwError } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GENERIC_HTTP_ERROR_MESSAGE } from './constants/http-error-message.constant';

describe('httpErrorInterceptor', () => {
  let globalStore: GlobalStoreType;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

  beforeEach(() => {
    globalStore = TestBed.inject(GlobalStore);
  });

  it('should have no errors', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be created', () => {
    expect(globalStore.error().error).toBeFalsy();
  });

  it('should intercept and set an error', () => {
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStore.error().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.error();
        expect(errorSignal.error).toBeTrue();
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should intercept and set an error.error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: new ErrorEvent('Error', {
        error: new Error('Error'),
        message: 'Error has occurred!',
        lineno: 402,
        filename: 'test.html',
      }),
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStore.error().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.error();
        expect(errorSignal.error).toBeTrue();
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should clear the state service on new requests', () => {
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = jasmine.createSpy().and.returnValue(of(null));

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(req, next).subscribe();
    });

    expect(globalStore.error()).toEqual({ error: false, message: '' });
  });

  it('should set the error message from error.detail when available', () => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: {
        detail: 'This is a problem detail error message',
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStore.error().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.error();
        expect(errorSignal.error).toBeTrue();
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });
});
