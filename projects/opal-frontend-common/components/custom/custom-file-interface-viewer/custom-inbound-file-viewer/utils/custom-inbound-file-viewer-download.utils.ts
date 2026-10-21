import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '../common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import { IFileDownloadOptions } from '@hmcts/opal-frontend-common/services/file-service';
import { getPathWithFileId } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import {
  OPAL_FILE_HANDLING_PATHS,
  OPAL_FILE_HANDLING_INTERFACE_FILE_CONTENT_ACCEPT,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/constants';
/**
 * Checks that a table row has a file ID and a downloadable status.
 *
 * @param row - The displayed interface-file row.
 * @returns Whether the row should expose a download action.
 */
export function canDownloadInterfaceFileRow(row: ICustomFileInterfaceViewerInboundTableWrapperTableData): boolean {
  return row['File ID'] !== null && (row.Status === 'Ready' || row.Status === 'File failed');
}

/**
 * Finds a file that is currently eligible for download.
 *
 * @param files - The current interface-file results.
 * @param fileId - The selected file ID.
 * @returns The matching downloadable file, or undefined when it is unavailable.
 */
export function getDownloadableInterfaceFile(
  files: ICustomFileInterfaceViewerInboundTableWrapperTableData[] | null,
  fileId: number,
): ICustomFileInterfaceViewerInboundTableWrapperTableData | undefined {
  const file = files?.find((item) => item['File ID'] === fileId);
  return file && canDownloadInterfaceFileRow(file) ? file : undefined;
}

/**
 * Builds the content endpoint for an interface file.
 *
 * @param fileId - The selected interface-file ID.
 * @returns The file-content API path with its encoded ID.
 */
export function getInterfaceFileDownloadHref(fileId: number): string {
  return getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId);
}

/**
 * Builds interface-file download settings using the caller-owned link and event.
 *
 * @param file - The file metadata used for the fallback filename.
 * @param link - The viewer-owned native download anchor.
 * @param event - The original action-link click event.
 * @returns Binary response settings, accepted formats and a fallback filename.
 */
export function getInterfaceFileDownloadOptions(
  file: ICustomFileInterfaceViewerInboundTableWrapperTableData,
  link: HTMLAnchorElement,
  event: Event,
): IFileDownloadOptions {
  return {
    link,
    event,
    responseType: 'blob',
    headers: { Accept: OPAL_FILE_HANDLING_INTERFACE_FILE_CONTENT_ACCEPT },
    fallbackFilename: file.Title || `interface-file-${file['File ID']}`,
  };
}
