import { HttpContext } from '@angular/common/http';
import {
  FileDownloadResponseType,
  FileDownloadHeadersType,
  FileDownloadParamsType,
} from '@hmcts/opal-frontend-common/services/file-service/types';
import { IFileSaveOptions } from './file-save-options.interface';

export interface IFileDownloadOptions extends IFileSaveOptions {
  /** URL response format; defaults to 'blob'. Caller-supplied Observable responses retain their own format. */
  responseType?: FileDownloadResponseType;
  headers?: FileDownloadHeadersType;
  params?: FileDownloadParamsType;
  context?: HttpContext;
  withCredentials?: boolean;
}
