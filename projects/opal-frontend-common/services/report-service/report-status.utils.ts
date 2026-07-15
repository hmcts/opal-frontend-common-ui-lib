import { REPORT_INSTANCE_STATUS, REPORT_INSTANCE_STATUS_DISPLAY } from './constants/report-instance-status.constant';

/**
 * Converts a report status code into title case display text.
 *
 * @param status - The report status code to convert.
 * @returns A display-friendly status value.
 */
export const toReportDisplayStatus = (status: string): string => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
};

/**
 * Gets the display status for a report instance.
 *
 * Applies shared report status rules before falling back to an API-provided display name or
 * title-cased status code.
 *
 * @param status - The report instance status code.
 * @param records - The number of records in the report instance, where available.
 * @param displayName - The API-provided status display name, where available.
 * @returns The display status for the report instance.
 */
export const getReportInstanceDisplayStatus = (
  status: string,
  records?: number | null,
  displayName?: string | null,
): string => {
  if (status === REPORT_INSTANCE_STATUS.requested) {
    return REPORT_INSTANCE_STATUS_DISPLAY.inProgress;
  }

  if (status === REPORT_INSTANCE_STATUS.ready && records === 0) {
    return REPORT_INSTANCE_STATUS_DISPLAY.noContent;
  }

  if (status === REPORT_INSTANCE_STATUS.inProgress) {
    return REPORT_INSTANCE_STATUS_DISPLAY.inProgress;
  }

  return displayName || toReportDisplayStatus(status);
};
