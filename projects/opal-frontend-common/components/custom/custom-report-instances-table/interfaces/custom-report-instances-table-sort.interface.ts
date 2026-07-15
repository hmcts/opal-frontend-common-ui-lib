import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { CUSTOM_REPORT_INSTANCES_TABLE_COLUMN } from '../constants/custom-report-instances-table-column.constant';

export interface ICustomReportInstancesTableSort extends IAbstractSortState {
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.dateAndTime]: 'ascending' | 'descending' | 'none';
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.title]: 'ascending' | 'descending' | 'none';
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.businessUnit]: 'ascending' | 'descending' | 'none';
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.createdBy]: 'ascending' | 'descending' | 'none';
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.status]: 'ascending' | 'descending' | 'none';
}
