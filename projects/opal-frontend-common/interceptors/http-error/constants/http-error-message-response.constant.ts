import { IErrorResponse } from '@hmcts/opal-frontend-common/interceptors/http-error/interfaces';

export const ERROR_RESPONSE: IErrorResponse = {
  type: null,
  title: 'There was a problem',
  status: null,
  detail: null,
  instance: null,
  operation_id: null,
  retriable: null,
};
