import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, defer, lastValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { MAX_HTTP_RETRY_COUNT } from './constants/http-retry-limits.constant';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';
import { httpRetryInterceptor, withHttpRetry } from './http-retry.interceptor';

describe('httpRetryInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => httpRetryInterceptor(req, next);

  function getTransientError(status = 504): HttpErrorResponse {
    return new HttpErrorResponse({ status });
  }

  function getAttemptingHandler(attempt: (attemptNumber: number) => HttpResponse<unknown> | HttpErrorResponse): {
    next: HttpHandlerFn;
    attempts: () => number;
  } {
    let attempts = 0;
    const next: HttpHandlerFn = () =>
      defer(() => {
        attempts += 1;
        const result = attempt(attempts);
        return result instanceof HttpErrorResponse ? throwError(() => result) : of(result);
      });

    return {
      next,
      attempts: () => attempts,
    };
  }

  it('should not retry by default', async () => {
    const errorResponse = getTransientError();
    const request = new HttpRequest('GET', '/test');
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should retry an opted-in transient error and return a later success', async () => {
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 2 ? successResponse : getTransientError(),
    );

    await expect(lastValueFrom(interceptor(request, next))).resolves.toBe(successResponse);

    expect(attempts()).toBe(2);
  });

  it('should retry before an outer error handler handles a failure', async () => {
    let handledErrors = 0;
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const outerErrorHandler: HttpInterceptorFn = (req, next) =>
      next(req).pipe(
        catchError((error) => {
          handledErrors += 1;
          return throwError(() => error);
        }),
      );
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 1, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 2 ? successResponse : getTransientError(),
    );

    await expect(
      lastValueFrom(outerErrorHandler(request, (retryRequest) => interceptor(retryRequest, next))),
    ).resolves.toBe(successResponse);

    expect(attempts()).toBe(2);
    expect(handledErrors).toBe(0);
  });

  it('should stop retrying after the opted-in retry count is exhausted', async () => {
    const errorResponse = getTransientError();
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(3);
  });

  it.each([400, 401, 403, 404, 409, 422])('should not retry non-retryable status %s', async (status) => {
    const errorResponse = new HttpErrorResponse({ status });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should not retry API responses marked as non-retriable', async () => {
    const errorResponse = new HttpErrorResponse({
      status: 504,
      error: {
        retriable: false,
      },
    });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should not retry statuses outside the common transient allow-list', async () => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0, retryableStatusCodes: [500] }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should not retry non-GET requests even when retry is enabled', async () => {
    const errorResponse = getTransientError();
    const request = new HttpRequest(
      'POST',
      '/test',
      {},
      {
        context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
      },
    );
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should bound retry counts from direct context policies', async () => {
    const errorResponse = getTransientError();
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 99, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(MAX_HTTP_RETRY_COUNT + 1);
  });

  it('should support direct HTTP_RETRY_POLICY context usage', async () => {
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const request = new HttpRequest('GET', '/test', {
      context: new HttpContext().set(HTTP_RETRY_POLICY, { retryCount: 1, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 2 ? successResponse : getTransientError(),
    );

    await expect(lastValueFrom(interceptor(request, next))).resolves.toBe(successResponse);

    expect(attempts()).toBe(2);
  });
});
