import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';

export interface ICustomReportInstancesTableSort extends IAbstractSortState {
  'Date and time': 'ascending' | 'descending' | 'none';
  Title: 'ascending' | 'descending' | 'none';
  'Business unit': 'ascending' | 'descending' | 'none';
  'Created by': 'ascending' | 'descending' | 'none';
  Status: 'ascending' | 'descending' | 'none';
}
