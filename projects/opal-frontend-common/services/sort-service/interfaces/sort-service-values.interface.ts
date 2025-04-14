import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface ISortServiceValues<T extends SortableValuesType> {
  [key: string]: T;
}

export interface ISortServiceArrayValues extends Array<SortableValuesType> {
  [key: number]: SortableValuesType;
}
