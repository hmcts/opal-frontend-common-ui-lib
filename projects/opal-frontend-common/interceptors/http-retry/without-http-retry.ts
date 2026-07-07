import { HttpContext } from '@angular/common/http';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';

/**
 * Disables HTTP retry for a request by setting a zero retry count on its context.
 */
export function withoutHttpRetry(context = new HttpContext()): HttpContext {
  return context.set(HTTP_RETRY_POLICY, { retryCount: 0 });
}
