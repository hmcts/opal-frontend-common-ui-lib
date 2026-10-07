import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OPAL_FILE_HANDLING_PATHS } from './constants/opal-file-handling-paths.constant';
import { IOpalFileHandlingInterfaceFile } from './interfaces/opal-file-handling-interface-file.interface';
import { IOpalFileHandlingInterfaceFilesRefData } from './interfaces/opal-file-handling-interface-files-ref-data.interface';
import { IOpalFileHandlingInterfaceFileParams } from './interfaces/opal-file-handling-interface-file.params.interface';
const FILE_ID_PATH_PARAM = '{id}';
const INTERFACE_FILE_CONTENT_ACCEPT_HEADER =
  'application/xml, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Injectable({ providedIn: 'root' })
export class OpalFileHandlingService {
  private readonly http = inject(HttpClient);

  private getPathWithFileId(path: string, fileId: number): string {
    return path.replace(FILE_ID_PATH_PARAM, encodeURIComponent(fileId.toString()));
  }

  public getInterfaceFilesRefData(params?: IOpalFileHandlingInterfaceFileParams): Observable<IOpalFileHandlingInterfaceFilesRefData> {
    return this.http.get<IOpalFileHandlingInterfaceFilesRefData>(
      OPAL_FILE_HANDLING_PATHS.interfaceFilesRefData,
      { params: this.buildInterfaceFilesParams(params) },
    );
  }

  public getInterfaceFile(fileId: number): Observable<IOpalFileHandlingInterfaceFile> {
    return this.http.get<IOpalFileHandlingInterfaceFile>(
      this.getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFile, fileId),
    );
  }

  public getInterfaceFileContent(fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(this.getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId), {
      headers: new HttpHeaders({
        Accept: INTERFACE_FILE_CONTENT_ACCEPT_HEADER,
      }),
      observe: 'response',
      responseType: 'blob',
    });
  }

  private buildInterfaceFilesParams(
    params?: IOpalFileHandlingInterfaceFileParams,): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value
          .filter((item) => item !== undefined && item !== null && item !== '')
          .forEach((item) => {
            httpParams = httpParams.append(key, String(item));
          });
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
}
