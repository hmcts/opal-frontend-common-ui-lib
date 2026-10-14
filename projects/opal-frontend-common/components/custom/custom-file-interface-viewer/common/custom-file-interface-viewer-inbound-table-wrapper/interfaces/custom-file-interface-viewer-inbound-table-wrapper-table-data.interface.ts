import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface ICustomFileInterfaceViewerInboundTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'File ID': number | null;
  'Date and time': string | null;
  Title: string | null;
  Type: string | null;
  'Business unit': string | null;
  Source: string | null;
  Status: string | null;
  Actions: string | null;
}
