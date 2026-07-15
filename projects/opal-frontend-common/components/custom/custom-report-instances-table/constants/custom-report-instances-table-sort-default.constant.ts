import { ICustomReportInstancesTableSort } from '../interfaces/custom-report-instances-table-sort.interface';
import { CUSTOM_REPORT_INSTANCES_TABLE_COLUMN } from './custom-report-instances-table-column.constant';

export const CUSTOM_REPORT_INSTANCES_TABLE_SORT_DEFAULT: ICustomReportInstancesTableSort = {
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.dateAndTime]: 'descending',
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.title]: 'none',
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.businessUnit]: 'none',
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.createdBy]: 'none',
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.status]: 'none',
};
