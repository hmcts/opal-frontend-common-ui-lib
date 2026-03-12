import { MultiSelectRowIdentifier } from '../types/moj-multi-select.types';

/**
 * Resolves a unique row id from a row value and its index.
 */
export type MultiSelectRowIdResolver<TRow, TRowId extends MultiSelectRowIdentifier> = (
  row: TRow,
  index: number,
) => TRowId;

/**
 * Checks whether a single row is currently selected.
 *
 * @param row - Row object to evaluate.
 * @param index - Row index passed to the id resolver.
 * @param selectedRowIds - Current selected row id set.
 * @param getRowId - Resolver used to extract row id.
 */
export const isMultiSelectRowSelected = <TRow, TRowId extends MultiSelectRowIdentifier>(
  row: TRow,
  index: number,
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
): boolean => selectedRowIds.has(getRowId(row, index));

/**
 * Checks whether all visible rows are selected.
 * Returns false when there are no rows.
 *
 * @param rows - Rows currently displayed.
 * @param selectedRowIds - Current selected row id set.
 * @param getRowId - Resolver used to extract row id.
 */
export const areAllMultiSelectRowsSelected = <TRow, TRowId extends MultiSelectRowIdentifier>(
  rows: readonly TRow[],
  selectedRowIds: ReadonlySet<TRowId>,
  getRowId: MultiSelectRowIdResolver<TRow, TRowId>,
): boolean => rows.length > 0 && rows.every((row, index) => selectedRowIds.has(getRowId(row, index)));

/**
 * Checks whether selection is partial for the current rows.
 * Returns true only when at least one row is selected and at least one is unselected.
 *
 * @param rows - Rows currently displayed.
 * @param selectedRowIds - Current selected row id set.
 * @param getRowId - Resolver used to extract row id.
 */
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

/**
 * Toggles selection for a single row id and returns a new selection set.
 *
 * @param selectedRowIds - Current selected row id set.
 * @param rowId - Row id to add or remove.
 * @param checked - True to add; false to remove.
 */
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

/**
 * Toggles selection for all visible rows and returns a new selection set.
 * Existing ids not present in `rows` are preserved.
 *
 * @param rows - Rows currently displayed.
 * @param selectedRowIds - Current selected row id set.
 * @param getRowId - Resolver used to extract row id.
 * @param checked - True to add visible ids; false to remove visible ids.
 */
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
