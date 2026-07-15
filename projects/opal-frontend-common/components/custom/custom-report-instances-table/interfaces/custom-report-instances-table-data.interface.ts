import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { CUSTOM_REPORT_INSTANCES_TABLE_COLUMN } from '../constants/custom-report-instances-table-column.constant';

export interface ICustomReportInstancesTableData extends IAbstractTableData<SortableValuesType> {
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.dateAndTime]: number;
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.title]: string;
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.businessUnit]: string;
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.createdBy]: string;
  [CUSTOM_REPORT_INSTANCES_TABLE_COLUMN.status]: string;
  instanceId: string;
  dateTimeDisplay: string;
  isActionable: boolean;
  actionLabels: string;
}
