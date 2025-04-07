import { SortableValues } from '@hmcts/opal-frontend-common/types';

export interface ISortServiceValues<T extends SortableValues> {
  [key: string]: T;
}

export interface ISortServiceArrayValues extends Array<SortableValues> {
  [key: number]: SortableValues;
}
