import { IErrorResponse } from '@hmcts/opal-frontend-common/interceptors/http-error/interfaces';
import { GENERIC_HTTP_ERROR_MESSAGE } from './http-error-message.constant';

export const ERROR_RESPONSE: IErrorResponse = {
  type: null,
  title: null,
  status: null,
  detail: GENERIC_HTTP_ERROR_MESSAGE,
  instance: null,
  operation_id: null,
  retriable: null,
};
