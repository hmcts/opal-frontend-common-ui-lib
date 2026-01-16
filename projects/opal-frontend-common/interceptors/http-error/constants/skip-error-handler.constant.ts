import { HttpContextToken } from '@angular/common/http';
import { ISkipErrorHandlerCondition } from '@hmcts/opal-frontend-common/interceptors/http-error/interfaces';

export const SKIP_HTTP_ERROR_HANDLER = new HttpContextToken<null | ISkipErrorHandlerCondition>(() => null);
