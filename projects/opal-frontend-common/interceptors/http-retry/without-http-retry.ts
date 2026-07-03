import { HttpContext } from '@angular/common/http';
import { HTTP_RETRY_POLICY } from './constants/http-retry-policy-token.constant';

export function withoutHttpRetry(context = new HttpContext()): HttpContext {
  return context.set(HTTP_RETRY_POLICY, { retryCount: 0 });
}
