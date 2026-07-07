import { HttpContextToken } from '@angular/common/http';
import type { IHttpRetryPolicyOptions } from '../interfaces/http-retry-policy.interface';

export const HTTP_RETRY_POLICY = new HttpContextToken<IHttpRetryPolicyOptions>(() => ({}));
