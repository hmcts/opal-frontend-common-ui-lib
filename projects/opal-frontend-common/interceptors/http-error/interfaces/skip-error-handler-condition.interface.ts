import { IErrorResponse } from './http-error-retrievable-error-response.interface';

export interface ISkipErrorHandlerCondition {
  key: string;
  value: string;
  customErrorMessageKey?: keyof IErrorResponse;
}
