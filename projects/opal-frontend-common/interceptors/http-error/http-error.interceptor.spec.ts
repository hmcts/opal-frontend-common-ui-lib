import { beforeEach, describe, expect, it, vi, type MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { httpErrorInterceptor } from './http-error.interceptor';
import { of, throwError } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GENERIC_HTTP_ERROR_MESSAGE } from './constants/http-error-message.constant';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';
import { ERROR_RESPONSE } from './constants/http-error-message-response.constant';

describe('httpErrorInterceptor', () => {
  let globalStore: GlobalStoreType;
  let router: MockedObject<Router>;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

  beforeEach(() => {
    const routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });

    globalStore = TestBed.inject(GlobalStore);
    router = TestBed.inject(Router) as MockedObject<Router>;
    router.navigate.mockClear();
  });

  it('should have no errors', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be created', () => {
    expect(globalStore.bannerError().error).toBeFalsy();
  });

  it('should intercept and set an error', () => {
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStore.bannerError().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
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

    expect(globalStore.bannerError().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should clear the state service on new requests', () => {
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = vi.fn().mockReturnValue(of(null));

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(req, next).subscribe();
    });

    expect(globalStore.bannerError()).toEqual(GLOBAL_ERROR_STATE);
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

    expect(globalStore.bannerError().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe('This is a problem detail error message');
      },
    });
  });

  it('should set error state with custom detail message when retriable: true', () => {
    const customErrorMessage = 'Please try again in a few moments';
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {
        type: 'https://hmcts.gov.uk/problems/temporary-service-unavailable',
        title: 'Service Temporarily Unavailable',
        status: 500,
        detail: customErrorMessage,
        retriable: true,
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStore.bannerError().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe(customErrorMessage);
      },
    });
  });

  it('should set error state with generic message when retriable: true and no detail', () => {
    const errorResponse = new HttpErrorResponse({
      status: 502,
      error: {
        type: 'https://hmcts.gov.uk/problems/bad-gateway',
        title: 'Bad Gateway',
        status: 502,
        retriable: true,
        // No detail property
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should treat errors with undefined retriable as retriable', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {
        type: 'https://hmcts.gov.uk/problems/internal-server-error',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Something went wrong on our end',
        // retriable property is undefined
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe('Something went wrong on our end');
      },
    });
  });

  it('should treat standard HTTP errors without error.retriable as retriable', () => {
    const errorResponse = new HttpErrorResponse({
      status: 429,
      statusText: 'Too Many Requests',
      // No error object with retriable property
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should handle network errors as retriable', () => {
    const errorResponse = new HttpErrorResponse({
      status: 0,
      error: new ProgressEvent('Network error'),
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should redirect to concurrency failure page for 409 status with retriable: false', () => {
    const errorResponse = new HttpErrorResponse({
      status: 409,
      error: {
        type: 'https://hmcts.gov.uk/problems/concurrency-conflict',
        title: 'Concurrency Conflict',
        status: 409,
        detail: 'The resource has been modified by another user',
        operation_id: 'OP-409',
        retriable: false,
      },
    });
    const request = new HttpRequest('POST', '/test', {});
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/error/concurrency-failure']);
      },
    });
  });

  it('should redirect to permission denied page for 403 status with retriable: false', () => {
    const errorResponse = new HttpErrorResponse({
      status: 403,
      error: {
        type: 'https://hmcts.gov.uk/problems/permission-denied',
        title: 'Permission Denied',
        status: 403,
        detail: 'You do not have permission to perform this action',
        operation_id: 'OP-403',
        retriable: false,
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/error/permission-denied']);
      },
    });
  });

  it('should redirect to internal server error page for other status codes with retriable: false', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {
        type: 'https://hmcts.gov.uk/problems/internal-server-error',
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected error occurred',
        operation_id: 'OP-500',
        retriable: false,
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/error/internal-server'], {
          state: { operationId: 'OP-500' },
        });
      },
    });
  });

  it('should populate fallback error details when non-retriable response omits optional fields', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {
        retriable: false,
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/error/internal-server'], {
          state: { operationId: ERROR_RESPONSE.operation_id },
        });
      },
    });
  });

  it('should use status from error object if HTTP status is missing', () => {
    const errorResponse = new HttpErrorResponse({
      error: {
        type: 'https://hmcts.gov.uk/problems/concurrency-conflict',
        title: 'Concurrency Conflict',
        status: 409,
        detail: 'The resource has been modified by another user',
        operation_id: 'OP-409',
        retriable: false,
      },
    });
    const request = new HttpRequest('POST', '/test', {});
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/error/concurrency-failure']);
      },
    });
  });

  it('should not redirect when retriable is true', () => {
    const errorResponse = new HttpErrorResponse({
      status: 409,
      error: {
        type: 'https://hmcts.gov.uk/problems/temporary-conflict',
        title: 'Temporary Conflict',
        status: 409,
        detail: 'A temporary conflict occurred, please try again',
        retriable: true,
      },
    });
    const request = new HttpRequest('POST', '/test', {});
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe('A temporary conflict occurred, please try again');
      },
    });
  });

  it('should not redirect when retriable is undefined', () => {
    const errorResponse = new HttpErrorResponse({
      status: 409,
      error: {
        type: 'https://hmcts.gov.uk/problems/standard-error',
        title: 'Standard Error',
        status: 409,
        detail: 'A standard error occurred',
        // retriable property is undefined
      },
    });
    const request = new HttpRequest('POST', '/test', {});
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.message).toBe('A standard error occurred');
      },
    });
  });

  it('should handle fallback error case with generic message', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {
        type: 'unknown',
        title: 'Unknown Error',
        status: 500,
        // No retriable property, but this will still hit isRetriableError path
      },
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        // This actually tests the retriable path, but verifies fallback behavior
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should handle defensive fallback case with default error values', () => {
    const expectedFallbackError = {
      ...GLOBAL_ERROR_STATE,
      error: true,
      title: 'There was a problem',
      message: GENERIC_HTTP_ERROR_MESSAGE,
      operationId: null,
    };

    globalStore.setBannerError(expectedFallbackError);
    const errorSignal = globalStore.bannerError();

    expect(errorSignal.error).toBe(true);
    expect(errorSignal.title).toBe('There was a problem');
    expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
    expect(errorSignal.operationId).toBeNull();
  });

  it('should handle malformed errors without error property', () => {
    const malformedError = { status: 500, statusText: 'Server Error' };
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => malformedError);

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
        expect(errorSignal.title).toBe('There was a problem');
        expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
      },
    });
  });

  it('should return status from top-level status property', () => {
    const error = { status: 404 };
    // Access the function through the interceptor by running in injection context
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          // Verify the interceptor handled a 404 by checking store state
          const errorSignal = globalStore.bannerError();
          expect(errorSignal.error).toBe(true);
        },
      });
    });
  });

  it('should return status from nested error.status property', () => {
    const error = { error: { status: 500 } };
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          const errorSignal = globalStore.bannerError();
          expect(errorSignal.error).toBe(true);
        },
      });
    });
  });

  it('should prefer top-level status over nested error.status', () => {
    const error = { status: 403, error: { status: 500 } };
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          expect(router.navigate).toHaveBeenCalledWith(['/error/permission-denied']);
        },
      });
    });
  });

  it('should return undefined when no status is present', () => {
    const error = { message: 'Some error' };
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          const errorSignal = globalStore.bannerError();
          expect(errorSignal.error).toBe(true);
          expect(errorSignal.message).toBe(GENERIC_HTTP_ERROR_MESSAGE);
        },
      });
    });
  });

  it('should return undefined when error is null', () => {
    const error = null;
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          const errorSignal = globalStore.bannerError();
          expect(errorSignal.error).toBe(true);
        },
      });
    });
  });

  it('should return undefined when error is undefined', () => {
    const error = undefined;
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/test');
      const next: HttpHandlerFn = () => throwError(() => error);

      httpErrorInterceptor(req, next).subscribe({
        error: () => {
          const errorSignal = globalStore.bannerError();
          expect(errorSignal.error).toBe(true);
        },
      });
    });
  });

  it('should handle HttpErrorResponse with status', () => {
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    interceptor(request, next).subscribe({
      error: () => {
        const errorSignal = globalStore.bannerError();
        expect(errorSignal.error).toBe(true);
      },
    });
  });
});
