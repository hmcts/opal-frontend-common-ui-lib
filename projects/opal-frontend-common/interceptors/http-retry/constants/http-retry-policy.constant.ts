import type { IHttpRetryPolicy } from '@hmcts/opal-frontend-common/interceptors/http-retry/interfaces';
import { HTTP_RETRYABLE_STATUS_CODES } from './http-retry-status-codes.constant';

export const HTTP_RETRY_DISABLED_POLICY: IHttpRetryPolicy = Object.freeze({
  retryCount: 0,
  delayMs: 0,
  backoffMultiplier: 1,
  maxDelayMs: 0,
  retryableStatusCodes: HTTP_RETRYABLE_STATUS_CODES,
});

export const DEFAULT_HTTP_RETRY_POLICY: IHttpRetryPolicy = Object.freeze({
  retryCount: 2,
  delayMs: 250,
  backoffMultiplier: 2,
  maxDelayMs: 2000,
  retryableStatusCodes: HTTP_RETRYABLE_STATUS_CODES,
});
