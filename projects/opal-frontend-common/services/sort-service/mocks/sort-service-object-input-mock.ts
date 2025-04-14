import { ISortServiceValues } from '../interfaces/sort-service-values.interface';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export const SORT_OBJECT_INPUT_MOCK: ISortServiceValues<SortableValuesType>[] = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
