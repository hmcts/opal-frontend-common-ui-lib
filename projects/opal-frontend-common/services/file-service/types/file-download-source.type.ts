import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export type FileDownloadSourceType = string | Observable<HttpResponse<BlobPart>>;
