import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IAbstractSortState {
  [key: string]: SortDirectionType;
}
export interface IAbstractTableData<T extends SortableValuesType> {
  [key: string]: T;
}
