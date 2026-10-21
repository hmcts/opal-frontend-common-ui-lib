import { HttpContext } from '@angular/common/http';
import { FileDownloadResponseType } from '../types/file-download-response.type';
import { FileDownloadHeadersType } from '../types/file-download-headers.type';
import { FileDownloadParamsType } from '../types/file-download-params.type';
import { IFileSaveOptions } from './file-save-options.interface';

export interface IFileDownloadOptions extends IFileSaveOptions {
  /** URL response format; defaults to 'blob'. Caller-supplied Observable responses retain their own format. */
  responseType?: FileDownloadResponseType;
  headers?: FileDownloadHeadersType;
  params?: FileDownloadParamsType;
  context?: HttpContext;
  withCredentials?: boolean;
}
