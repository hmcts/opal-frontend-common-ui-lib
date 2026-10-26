import { HttpParams } from '@angular/common/http';

export type FileDownloadParamsType =
  HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
