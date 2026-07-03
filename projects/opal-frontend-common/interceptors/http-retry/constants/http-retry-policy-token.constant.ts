import { HttpContextToken } from '@angular/common/http';
import type { IHttpRetryPolicyOptions } from '@hmcts/opal-frontend-common/interceptors/http-retry/interfaces';

export const HTTP_RETRY_POLICY = new HttpContextToken<IHttpRetryPolicyOptions>(() => ({}));
