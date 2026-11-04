import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IFileDownloadOptions, IFileSaveOptions } from '@hmcts/opal-frontend-common/services/file-service/interfaces';
import {
  FILE_CONTENT_UNAVAILABLE_ERROR,
  FILE_DOWNLOAD_DEFAULT_FILENAME,
} from '@hmcts/opal-frontend-common/services/file-service/constants';
import { FileDownloadSourceType } from '@hmcts/opal-frontend-common/services/file-service/types';
import { getFileBlob } from './utils/file-blob.utils';
import { getFileResponseOptions } from './utils/file-response-options.utils';
import { saveFileToLink } from './utils/file-save-link.utils';

/** File download operations and stateless helpers for application-owned uploads. */
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

  /** Returns the first non-blank problem description or title from an HTTP response body. */
  private getFileUploadProblemMessage(body: unknown): string | null {
    if (!body || typeof body !== 'object') {
      return null;
    }

    const description = 'description' in body ? body.description : undefined;
    const title = 'title' in body ? body.title : undefined;
    for (const value of [description, title]) {
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return null;
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

  /**
   * Converts transferred bytes to a rounded percentage between 0 and 100.
   * @returns null when progress cannot be calculated; 100 does not confirm an upload response.
   */
  public getFileUploadProgress(loaded: number, total?: number | null): number | null {
    if (!Number.isFinite(loaded) || total == null || !Number.isFinite(total) || total <= 0) {
      return null;
    }

    return Math.max(0, Math.min(100, Math.round((loaded / total) * 100)));
  }

  /**
   * Checks an inclusive byte limit without reading file content.
   * @returns false when the size or limit is negative or not finite.
   */
  public isFileWithinSizeLimit(file: Pick<File, 'size'>, maxBytes: number): boolean {
    return (
      Number.isFinite(file.size) &&
      file.size >= 0 &&
      Number.isFinite(maxBytes) &&
      maxBytes >= 0 &&
      file.size <= maxBytes
    );
  }

  /**
   * Matches a case-insensitive extension, with or without its leading dot.
   * @returns false for an empty extension; MIME types and other filename rules remain caller-owned.
   */
  public hasFileExtension(filename: string, extension: string): boolean {
    if (!extension || extension === '.') {
      return false;
    }

    const suffix = extension.startsWith('.') ? extension : `.${extension}`;
    return filename.toLowerCase().endsWith(suffix.toLowerCase());
  }

  /**
   * Resolves an HTTP problem description/title or Error message for an upload failure.
   * @returns The trimmed message or the caller's fallback when no supported message is available.
   */
  public getFileUploadErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof HttpErrorResponse) {
      return this.getFileUploadProblemMessage(error.error) ?? fallbackMessage;
    }
    if (error instanceof Error) {
      return error.message.trim() || fallbackMessage;
    }

    return fallbackMessage;
  }
}
