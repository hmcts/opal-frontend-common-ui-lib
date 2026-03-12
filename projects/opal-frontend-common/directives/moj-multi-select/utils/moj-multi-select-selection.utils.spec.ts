import { describe, expect, it } from 'vitest';
import {
  areAllMultiSelectRowsSelected,
  areSomeMultiSelectRowsSelected,
  isMultiSelectRowSelected,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from './moj-multi-select-selection.utils';

interface ITestRow {
  id: string;
  name: string;
}

describe('moj-multi-select-selection.utils', () => {
  const rows: ITestRow[] = [
    { id: 'A', name: 'Alpha' },
    { id: 'B', name: 'Beta' },
    { id: 'C', name: 'Gamma' },
  ];

  const getRowId = (row: ITestRow) => row.id;

  it('should report a selected row', () => {
    const selectedRowIds = new Set<string>(['B']);

    expect(isMultiSelectRowSelected(rows[1], 1, selectedRowIds, getRowId)).toBe(true);
    expect(isMultiSelectRowSelected(rows[0], 0, selectedRowIds, getRowId)).toBe(false);
  });

  it('should detect when all rows are selected', () => {
    const selectedRowIds = new Set<string>(['A', 'B', 'C']);

    expect(areAllMultiSelectRowsSelected(rows, selectedRowIds, getRowId)).toBe(true);
  });

  it('should detect partial selection for indeterminate state', () => {
    const selectedRowIds = new Set<string>(['A']);

    expect(areSomeMultiSelectRowsSelected(rows, selectedRowIds, getRowId)).toBe(true);
    expect(areSomeMultiSelectRowsSelected(rows, new Set<string>(), getRowId)).toBe(false);
    expect(areSomeMultiSelectRowsSelected(rows, new Set<string>(['A', 'B', 'C']), getRowId)).toBe(false);
  });

  it('should return false for partial selection when rows are empty', () => {
    expect(areSomeMultiSelectRowsSelected([], new Set<string>(['A']), getRowId)).toBe(false);
  });

  it('should toggle a single row selection', () => {
    const selectedRowIds = new Set<string>(['A']);

    const selected = toggleMultiSelectRow(selectedRowIds, 'B', true);
    const deselected = toggleMultiSelectRow(selected, 'A', false);

    expect(selected.has('A')).toBe(true);
    expect(selected.has('B')).toBe(true);
    expect(deselected.has('A')).toBe(false);
    expect(deselected.has('B')).toBe(true);
  });

  it('should toggle all visible rows', () => {
    const selectedRowIds = new Set<string>(['X']);

    const selected = toggleAllMultiSelectRows(rows, selectedRowIds, getRowId, true);
    const deselected = toggleAllMultiSelectRows(rows, selected, getRowId, false);

    expect(selected.has('A')).toBe(true);
    expect(selected.has('B')).toBe(true);
    expect(selected.has('C')).toBe(true);
    expect(selected.has('X')).toBe(true);

    expect(deselected.has('A')).toBe(false);
    expect(deselected.has('B')).toBe(false);
    expect(deselected.has('C')).toBe(false);
    expect(deselected.has('X')).toBe(true);
  });
});
