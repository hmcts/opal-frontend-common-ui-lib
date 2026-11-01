import { HttpResponse } from '@angular/common/http';
import { FILE_DOWNLOAD_DEFAULT_FILENAME } from '@hmcts/opal-frontend-common/services/file-service/constants';
import { IFileSaveOptions } from '@hmcts/opal-frontend-common/services/file-service/interfaces';
import { getFileDownloadFilename } from './file-download-filename.utils';

/**
 * Resolves filename and MIME preferences without mutating the response or caller options.
 * @param response - File response whose headers and existing Blob MIME label provide defaults.
 * @param options - Caller overrides and fallback filename, including the anchor to retain.
 * @returns Copied options with the chosen filename and MIME label; explicit overrides take precedence.
 */
export function getFileResponseOptions(response: HttpResponse<BlobPart>, options: IFileSaveOptions): IFileSaveOptions {
  const filename =
    options.filename ||
    getFileDownloadFilename(
      response.headers.get('Content-Disposition'),
      options.fallbackFilename || FILE_DOWNLOAD_DEFAULT_FILENAME,
    );
  const mimeType =
    options.mimeType ??
    (response.body instanceof Blob ? response.body.type || undefined : undefined) ??
    response.headers.get('Content-Type') ??
    undefined;

  return { ...options, filename, mimeType };
}
