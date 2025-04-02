import { SortableValues, SortDirectionType } from '@hmcts/opal-frontend-common/types';

export interface IAbstractSortState {
  [key: string]: SortDirectionType;
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
