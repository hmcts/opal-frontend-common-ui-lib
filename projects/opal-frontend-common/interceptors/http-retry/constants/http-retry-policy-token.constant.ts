import { HttpContextToken } from '@angular/common/http';
import type { IHttpRetryPolicyOptions } from '@hmcts/opal-frontend-common/interceptors/http-retry/interfaces';
import { HTTP_RETRY_DISABLED_POLICY } from './http-retry-policy.constant';

export const HTTP_RETRY_POLICY = new HttpContextToken<IHttpRetryPolicyOptions>(() => HTTP_RETRY_DISABLED_POLICY);
