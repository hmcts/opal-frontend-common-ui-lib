import { HttpContext } from '@angular/common/http';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';
import { normalizeHttpRetryPolicy } from './utils/http-retry.utils';
import type { IHttpRetryPolicyOptions } from './interfaces/http-retry-policy.interface';

/**
 * Enables HTTP retry for a request by adding the normalized retry policy to its context.
 */
export function withHttpRetry(policy: IHttpRetryPolicyOptions, context = new HttpContext()): HttpContext {
  return context.set(HTTP_RETRY_POLICY, normalizeHttpRetryPolicy(policy));
}
