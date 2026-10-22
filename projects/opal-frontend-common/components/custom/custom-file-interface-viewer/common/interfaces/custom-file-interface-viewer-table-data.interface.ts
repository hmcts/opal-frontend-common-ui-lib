import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface ICustomFileInterfaceViewerTableData extends IAbstractTableData<SortableValuesType> {
  'File ID': number | null;
  'Date and time': number | null;
  dateTimeDisplay: string | null;
  Title: string | null;
  'Business unit': string | null;
  Status: string | null;
  Actions: string | null;
}
