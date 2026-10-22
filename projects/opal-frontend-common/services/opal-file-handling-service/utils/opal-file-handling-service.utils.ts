import { HttpParams } from '@angular/common/http';
import { IOpalFileHandlingInterfaceFileParams } from '../interfaces/opal-file-handling-interface-file.params.interface';
import { OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM } from '../constants/opal-file-handling-file-id-path-param.constant';

/**
 * Replaces an endpoint's file-ID placeholder with the URL-encoded identifier.
 * @param path - Endpoint path containing the {id} placeholder.
 * @param fileId - Numeric file identifier to insert.
 * @returns The endpoint path with its file-ID placeholder resolved.
 */
export function getPathWithFileId(path: string, fileId: number): string {
  return path.replace(OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM, encodeURIComponent(fileId.toString()));
}

/**
 * Serializes non-empty search criteria, using comma-separated query values for array filters.
 * @param params - Optional interface-file filters; null, undefined and empty values are omitted.
 * @returns HTTP query parameters containing the supplied non-empty filter values.
 */
export function buildInterfaceFilesParams(params?: IOpalFileHandlingInterfaceFileParams): HttpParams {
  let httpParams = new HttpParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      const values = value.filter((item) => item !== undefined && item !== null && item !== '');
      if (values.length > 0) {
        httpParams = httpParams.set(key, values.join(','));
      }
      return;
    }

    httpParams = httpParams.set(key, String(value));
  });

  return httpParams;
}
