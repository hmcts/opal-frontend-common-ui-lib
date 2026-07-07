import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, defer, lastValueFrom, of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAX_HTTP_RETRY_COUNT } from './constants/http-retry-count.constant';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';
import { httpRetryInterceptor } from './http-retry.interceptor';
import { withHttpRetry } from './with-http-retry';
import { withoutHttpRetry } from './without-http-retry';

describe('httpRetryInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => httpRetryInterceptor(req, next);

  function getTransientError(status = 504): HttpErrorResponse {
    return new HttpErrorResponse({ status });
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  function getAttemptingHandler(attempt: (attemptNumber: number) => HttpResponse<unknown> | unknown): {
    next: HttpHandlerFn;
    attempts: () => number;
  } {
    let attempts = 0;
    const next: HttpHandlerFn = () =>
      defer(() => {
        attempts += 1;
        const result = attempt(attempts);
        return result instanceof HttpResponse ? of(result) : throwError(() => result);
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

  it('should not retry when retry is disabled on an existing context', async () => {
    const errorResponse = getTransientError();
    const retryContext = withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 });
    const request = new HttpRequest('GET', '/test', {
      context: withoutHttpRetry(retryContext),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
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

  it('should retry custom allowed transient statuses and ignore duplicate custom statuses', async () => {
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({
        retryCount: 2,
        delayMs: 0,
        maxDelayMs: 0,
        retryableStatusCodes: [502, 502, 500],
      }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 2 ? successResponse : getTransientError(502),
    );

    await expect(lastValueFrom(interceptor(request, next))).resolves.toBe(successResponse);

    expect(attempts()).toBe(2);
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

  it('should not retry when the error status cannot be resolved', async () => {
    const malformedError = { status: '504' };
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => malformedError);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(malformedError);

    expect(attempts()).toBe(1);
  });

  it('should retry errors with a nested retryable status', async () => {
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const nestedTransientError = { error: { status: 503 } };
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 2 ? successResponse : nestedTransientError,
    );

    await expect(lastValueFrom(interceptor(request, next))).resolves.toBe(successResponse);

    expect(attempts()).toBe(2);
  });

  it('should not retry errors with a non-numeric nested status', async () => {
    const malformedNestedError = { error: { status: '503' } };
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => malformedNestedError);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(malformedNestedError);

    expect(attempts()).toBe(1);
  });

  it('should not retry non-object errors', async () => {
    const errorResponse = 'Gateway timeout';
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 0, maxDelayMs: 0 }),
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

  it('should clamp negative retry counts to zero', async () => {
    const errorResponse = getTransientError();
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: -1, delayMs: 0, maxDelayMs: 0 }),
    });
    const { next, attempts } = getAttemptingHandler(() => errorResponse);

    await expect(lastValueFrom(interceptor(request, next))).rejects.toBe(errorResponse);

    expect(attempts()).toBe(1);
  });

  it('should use bounded retry delays with backoff', async () => {
    vi.useFakeTimers();
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });
    const request = new HttpRequest('GET', '/test', {
      context: withHttpRetry({ retryCount: 2, delayMs: 10, backoffMultiplier: 3, maxDelayMs: 25 }),
    });
    const { next, attempts } = getAttemptingHandler((attemptNumber) =>
      attemptNumber === 3 ? successResponse : getTransientError(),
    );

    const result = lastValueFrom(interceptor(request, next));

    expect(attempts()).toBe(1);

    await vi.advanceTimersByTimeAsync(9);
    expect(attempts()).toBe(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(attempts()).toBe(2);

    await vi.advanceTimersByTimeAsync(24);
    expect(attempts()).toBe(2);

    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBe(successResponse);
    expect(attempts()).toBe(3);
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
