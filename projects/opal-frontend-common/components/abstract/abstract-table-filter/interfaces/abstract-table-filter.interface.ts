import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/types';

export interface IAbstractTableFilterOption {
  label: string;
  value: string | number;
  count?: number;
  selected: boolean;
}

export interface IAbstractTableFilterCategory {
  categoryName: string;
  options: IAbstractTableFilterOption[];
}

export interface IAbstractTableData<T extends SortableValuesType> {
  [key: string]: T | T[];
}
