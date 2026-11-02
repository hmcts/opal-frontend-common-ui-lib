import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IFileDownloadOptions } from './interfaces/file-download-options.interface';
import { IFileSaveOptions } from './interfaces/file-save-options.interface';
import { FILE_CONTENT_UNAVAILABLE_ERROR } from './constants/file-content-unavailable-error.constant';
import { FILE_DOWNLOAD_DEFAULT_FILENAME } from './constants/file-download-default-filename.constant';
import { FileDownloadSourceType } from './types/file-download-source.type';
import { getFileBlob } from './utils/file-blob.utils';
import { getFileResponseOptions } from './utils/file-response-options.utils';
import { saveFileToLink } from './utils/file-save-link.utils';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly http = inject(HttpClient);

  /**
   * Creates a GET request with the caller's response format and HTTP settings.
   * @param url - Backend URL from which to retrieve file content.
   * @param options - Headers, query parameters, context, credentials and response format.
   * @returns A cold Observable that requests the full HTTP response on subscription.
   */
  private getResponse(url: string, options: IFileDownloadOptions): Observable<HttpResponse<BlobPart>> {
    const requestOptions = {
      headers: options.headers,
      params: options.params,
      context: options.context,
      withCredentials: options.withCredentials,
      observe: 'response' as const,
    };
    switch (options.responseType) {
      case 'text':
        return this.http.get(url, { ...requestOptions, responseType: 'text' });
      case 'arraybuffer':
        return this.http.get(url, { ...requestOptions, responseType: 'arraybuffer' });
      default:
        return this.http.get(url, { ...requestOptions, responseType: 'blob' });
    }
  }

  /**
   * Wraps file content in a Blob, optionally relabelling its MIME type without converting the file format.
   * @param content - Existing Blob, text or binary content to save.
   * @param mimeType - Optional MIME label to apply to the content.
   * @returns The existing Blob when its MIME label is unchanged, otherwise a Blob containing the same content.
   */
  public createBlob(content: BlobPart, mimeType?: string): Blob {
    return getFileBlob(content, mimeType);
  }

  /**
   * Prevents the supplied event's default action and starts a native download through the caller-owned anchor.
   * @param content - Blob, text or binary content to download.
   * @param options - Save anchor, optional event, filename preferences and optional MIME label.
   */
  public saveFile(content: BlobPart, options: IFileSaveOptions): void {
    const { event, ...saveOptions } = options;
    event?.preventDefault();
    saveFileToLink(
      this.createBlob(content, saveOptions.mimeType),
      saveOptions.link,
      saveOptions.filename || saveOptions.fallbackFilename || FILE_DOWNLOAD_DEFAULT_FILENAME,
    );
  }

  /**
   * Saves response content using filename and MIME preferences resolved from the options, Blob and headers.
   * @param response - HTTP response containing the file content and any download headers.
   * @param options - Caller-owned anchor, optional event and overrides for the download.
   * @throws Error when the response has no body; empty content remains a valid file.
   */
  public saveResponse(response: HttpResponse<BlobPart>, options: IFileSaveOptions): void {
    const { event, ...saveOptions } = options;
    event?.preventDefault();
    if (response.body === null) {
      throw new Error(FILE_CONTENT_UNAVAILABLE_ERROR);
    }

    this.saveFile(response.body, getFileResponseOptions(response, saveOptions));
  }

  /**
   * Downloads a URL or supplied response Observable, preventing the event's default action immediately.
   * @param source - Backend URL or response Observable supplied for any HTTP method.
   * @param options - Save settings and HTTP options; request settings apply only to URL sources.
   * @returns An Observable that saves received responses and forwards errors; the caller controls cancellation.
   */
  public downloadFile(source: FileDownloadSourceType, options: IFileDownloadOptions): Observable<void> {
    const { event, ...saveOptions } = options;
    event?.preventDefault();
    const response$ = typeof source === 'string' ? this.getResponse(source, saveOptions) : source;
    return response$.pipe(map((response) => this.saveResponse(response, saveOptions)));
  }
}
