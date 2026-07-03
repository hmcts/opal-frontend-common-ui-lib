import { HttpContext, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { of, retry, throwError, timer } from 'rxjs';
import {
  MAX_HTTP_RETRY_BACKOFF_MULTIPLIER,
  MAX_HTTP_RETRY_COUNT,
  MAX_HTTP_RETRY_DELAY_MS,
} from './constants/http-retry-limits.constant';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';
import {
  HTTP_NON_RETRYABLE_STATUS_CODES,
  HTTP_RETRYABLE_STATUS_CODES,
} from './constants/http-retry-status-codes.constant';
import type { IHttpRetryPolicy, IHttpRetryPolicyOptions } from './interfaces/http-retry-policy.interface';

export function withHttpRetry(policy: IHttpRetryPolicyOptions, context = new HttpContext()): HttpContext {
  return context.set(HTTP_RETRY_POLICY, normalizeHttpRetryPolicy(policy));
}

export function withoutHttpRetry(context = new HttpContext()): HttpContext {
  return context.set(HTTP_RETRY_POLICY, { retryCount: 0 });
}

function normalizeHttpRetryPolicy(policy: IHttpRetryPolicyOptions = {}): IHttpRetryPolicy {
  const delayMs = getBoundedInteger(policy.delayMs, 0, MAX_HTTP_RETRY_DELAY_MS);

  return {
    retryCount: getBoundedInteger(policy.retryCount, 0, MAX_HTTP_RETRY_COUNT),
    delayMs,
    backoffMultiplier: getBoundedNumber(policy.backoffMultiplier, 1, 1, MAX_HTTP_RETRY_BACKOFF_MULTIPLIER),
    maxDelayMs: getBoundedInteger(policy.maxDelayMs, delayMs, MAX_HTTP_RETRY_DELAY_MS),
    retryableStatusCodes: getRetryableStatusCodes(policy.retryableStatusCodes),
  };
}

function getBoundedInteger(value: number | undefined, fallback: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(Math.floor(value), 0), max);
}

function getBoundedNumber(value: number | undefined, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

function getRetryableStatusCodes(statusCodes: readonly number[] | undefined): readonly number[] {
  const codes = statusCodes ?? HTTP_RETRYABLE_STATUS_CODES;
  return [...new Set(codes.filter((statusCode) => HTTP_RETRYABLE_STATUS_CODES.includes(statusCode)))];
}

function isGetRequest(req: HttpRequest<unknown>): boolean {
  return req.method.toUpperCase() === 'GET';
}

function getStatusCode(error: unknown): number | undefined {
  if (!(error instanceof HttpErrorResponse) && (typeof error !== 'object' || error === null)) {
    return undefined;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const statusError = error as { status?: unknown };
    if (typeof statusError.status === 'number') {
      return statusError.status;
    }
  }

  if (typeof error === 'object' && error !== null && 'error' in error) {
    const nestedError = error as { error?: { status?: unknown } };
    if (typeof nestedError.error?.status === 'number') {
      return nestedError.error.status;
    }
  }

  return undefined;
}

function isApiNonRetriableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('error' in error)) {
    return false;
  }

  const responseError = (error as { error?: unknown }).error;
  return typeof responseError === 'object' && responseError !== null && 'retriable' in responseError
    ? (responseError as { retriable?: unknown }).retriable === false
    : false;
}

function isRetryableError(error: unknown, policy: IHttpRetryPolicy): boolean {
  if (isApiNonRetriableError(error)) {
    return false;
  }

  const statusCode = getStatusCode(error);
  if (statusCode === undefined || HTTP_NON_RETRYABLE_STATUS_CODES.includes(statusCode)) {
    return false;
  }

  return policy.retryableStatusCodes.includes(statusCode);
}

function getRetryDelayMs(policy: IHttpRetryPolicy, retryAttempt: number): number {
  const retryDelayMs = policy.delayMs * Math.pow(policy.backoffMultiplier, Math.max(retryAttempt - 1, 0));
  return Math.min(Math.round(retryDelayMs), policy.maxDelayMs);
}

function canRetryRequest(req: HttpRequest<unknown>, policy: IHttpRetryPolicy): boolean {
  return policy.retryCount > 0 && isGetRequest(req);
}

export const httpRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const retryPolicy = normalizeHttpRetryPolicy(req.context.get(HTTP_RETRY_POLICY));

  if (!canRetryRequest(req, retryPolicy)) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: retryPolicy.retryCount,
      delay: (error, retryAttempt) => {
        if (!isRetryableError(error, retryPolicy)) {
          return throwError(() => error);
        }

        const delayMs = getRetryDelayMs(retryPolicy, retryAttempt);
        return delayMs > 0 ? timer(delayMs) : of(0);
      },
    }),
  );
};
