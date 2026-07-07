import { HttpContextToken } from '@angular/common/http';
import type { IHttpRetryPolicyOptions } from './interfaces/http-retry-policy.interface';

/**
 * Stores per-request HTTP retry policy options in an Angular HTTP context.
 */
export const HTTP_RETRY_POLICY = new HttpContextToken<IHttpRetryPolicyOptions>(() => ({}));
