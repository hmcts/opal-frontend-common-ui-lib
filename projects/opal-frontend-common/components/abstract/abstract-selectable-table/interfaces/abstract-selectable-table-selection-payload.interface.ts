import { AbstractSelectableTableRowIdType } from '@hmcts/opal-frontend-common/components/abstract/abstract-selectable-table/types';

export interface IAbstractSelectableTableSelectionPayload {
  selectedIds: Set<AbstractSelectableTableRowIdType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedRows: any[];
}
