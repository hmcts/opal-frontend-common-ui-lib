import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OPAL_FILE_HANDLING_PATHS } from './constants/opal-file-handling-paths.constant';
import { OPAL_FILE_HANDLING_INTERFACE_FILE_CONTENT_ACCEPT } from './constants/opal-file-handling-interface-file-content-accept.constant';
import { IOpalFileHandlingInterfaceFile } from './interfaces/opal-file-handling-interface-file.interface';
import { IOpalFileHandlingInterfaceFilesRefData } from './interfaces/opal-file-handling-interface-files-ref-data.interface';
import { IOpalFileHandlingInterfaceFileParams } from './interfaces/opal-file-handling-interface-file.params.interface';
import { buildInterfaceFilesParams, getPathWithFileId } from './utils/opal-file-handling-service.utils';

@Injectable({ providedIn: 'root' })
export class OpalFileHandlingService {
  private readonly http = inject(HttpClient);

  /**
   * Requests interface-file metadata matching the supplied filters.
   * @param params - Optional search criteria; empty values are omitted from the request.
   * @returns A cold Observable of the matching file metadata and result count.
   */
  public getInterfaceFilesRefData(
    params?: IOpalFileHandlingInterfaceFileParams,
  ): Observable<IOpalFileHandlingInterfaceFilesRefData> {
    return this.http.get<IOpalFileHandlingInterfaceFilesRefData>(OPAL_FILE_HANDLING_PATHS.interfaceFilesRefData, {
      params: buildInterfaceFilesParams(params),
    });
  }

  /**
   * Requests the metadata for one interface file.
   * @param fileId - Numeric identifier of the file to retrieve.
   * @returns A cold Observable of the selected file's metadata.
   */
  public getInterfaceFile(fileId: number): Observable<IOpalFileHandlingInterfaceFile> {
    return this.http.get<IOpalFileHandlingInterfaceFile>(
      getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFile, fileId),
    );
  }

  /**
   * Requests original file content as a Blob while retaining response headers for download handling.
   * @param fileId - Numeric identifier of the file whose content is required.
   * @returns A cold Observable of the full binary HTTP response.
   */
  public getInterfaceFileContent(fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId), {
      headers: {
        Accept: OPAL_FILE_HANDLING_INTERFACE_FILE_CONTENT_ACCEPT,
      },
      observe: 'response',
      responseType: 'blob',
    });
  }
}
