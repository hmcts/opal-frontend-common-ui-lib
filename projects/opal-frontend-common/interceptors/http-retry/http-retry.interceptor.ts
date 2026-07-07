import { HttpInterceptorFn } from '@angular/common/http';
import { of, retry, throwError, timer } from 'rxjs';
import { HTTP_RETRY_POLICY } from './http-retry-policy-token.constant';
import { canRetryRequest, getRetryDelayMs, isRetryableError, normalizeHttpRetryPolicy } from './utils/http-retry.utils';

/**
 * Retries opted-in GET requests when they fail with configured transient HTTP errors.
 */
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
