import { HttpHeaders } from '@angular/common/http';

export type FileDownloadHeadersType = HttpHeaders | Record<string, string | string[]>;
