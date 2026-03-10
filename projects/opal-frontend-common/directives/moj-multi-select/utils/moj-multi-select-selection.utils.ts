import { MultiSelectRowIdentifier } from '../types/moj-multi-select.types';

export type MultiSelectRowIdResolver<TRow, TRowId extends MultiSelectRowIdentifier> = (
  row: TRow,
  index: number,
) => TRowId;

export const isMultiSelectRowSelected = <TRow, TRowId extends MultiSelectRowIdentifier>(
  row: TRow,
  index: number,
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
): boolean => selectedRowIds.has(getRowId(row, index));

export const areAllMultiSelectRowsSelected = <TRow, TRowId extends MultiSelectRowIdentifier>(
  rows: readonly TRow[],
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
): boolean => rows.length > 0 && rows.every((row, index) => selectedRowIds.has(getRowId(row, index)));

export const areSomeMultiSelectRowsSelected = <TRow, TRowId extends MultiSelectRowIdentifier>(
  rows: readonly TRow[],
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
): boolean => {
  if (rows.length === 0) {
    return false;
  }

  const selectedCount = rows.reduce(
    (count, row, index) => (selectedRowIds.has(getRowId(row, index)) ? count + 1 : count),
    0,
  );

  return selectedCount > 0 && selectedCount < rows.length;
};

export const toggleMultiSelectRow = <TRowId extends MultiSelectRowIdentifier>(
  selectedRowIds: ReadonlySet<TRowId>,
  rowId: TRowId,
  checked: boolean,
): Set<TRowId> => {
  const nextSelectedRowIds = new Set<TRowId>(selectedRowIds);

  if (checked) {
    nextSelectedRowIds.add(rowId);
  } else {
    nextSelectedRowIds.delete(rowId);
  }

  return nextSelectedRowIds;
};

export const toggleAllMultiSelectRows = <TRow, TRowId extends MultiSelectRowIdentifier>(
  rows: readonly TRow[],
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
  checked: boolean,
): Set<TRowId> => {
  const nextSelectedRowIds = new Set<TRowId>(selectedRowIds);

  rows.forEach((row, index) => {
    const rowId = getRowId(row, index);

    if (checked) {
      nextSelectedRowIds.add(rowId);
    } else {
      nextSelectedRowIds.delete(rowId);
    }
  });

  return nextSelectedRowIds;
};
