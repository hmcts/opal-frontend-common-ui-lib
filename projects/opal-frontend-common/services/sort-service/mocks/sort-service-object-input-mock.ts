import { ISortServiceValues } from '../interfaces/sort-service-values.interface';
import { SortableValues } from '@hmcts/opal-frontend-common/types';

export const SORT_OBJECT_INPUT_MOCK: ISortServiceValues<SortableValues>[] = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
