import { SortableValues } from '@hmcts/opal-frontend-common/types';
import { IAbstractTableData } from '../interfaces/abstract-sortable-table-interfaces';

export const MOCK_ABSTRACT_TABLE_DATA: IAbstractTableData<SortableValues>[] = [
  {
    imposition: 'Imposition 1',
    creditor: 'major',
    amountImposed: 1000,
    amountPaid: 200,
    balanceRemaining: 800,
  },
  {
    imposition: 'Imposition 2',
    creditor: 'minor',
    amountImposed: 1500,
    amountPaid: 500,
    balanceRemaining: 1000,
  },
  {
    imposition: 'Imposition 3',
    creditor: 'default',
    amountImposed: 2000,
    amountPaid: 1000,
    balanceRemaining: 1000,
  },
];
