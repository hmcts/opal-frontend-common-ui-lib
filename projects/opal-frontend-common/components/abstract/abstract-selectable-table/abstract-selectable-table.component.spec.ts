import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSelectableTableComponent } from './abstract-selectable-table.component';
import { AbstractSelectableTableRowIdType } from './types/abstract-selectable-table-row-id.type';

/**
 * Deterministic dataset used across tests
 */
const TEST_ROWS: Array<{ id: AbstractSelectableTableRowIdType; name: string }> = [
  { id: 1, name: 'Row 1' },
  { id: 2, name: 'Row 2' },
  { id: 3, name: 'Row 3' },
  { id: 4, name: 'Row 4' },
  { id: 5, name: 'Row 5' },
];

@Component({
  template: '', // Minimal template for the test component
})
class TestSelectableComponent extends AbstractSelectableTableComponent {
  constructor() {
    super();
    // seed default state similar to other abstract tests
    this.setTableData(TEST_ROWS);
    this.abstractExistingSortState = null;
    this.itemsPerPageSignal.set(2); // visible slice will be [1,2]
  }

  public override getRowId(row: unknown): AbstractSelectableTableRowIdType {
    return (row as { id: AbstractSelectableTableRowIdType }).id;
  }
}

describe('AbstractSelectableTableComponent (TestBed style)', () => {
  let component: TestSelectableComponent | null;
  let fixture: ComponentFixture<TestSelectableComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSelectableComponent],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: jasmine.createSpy('detectChanges') },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rowIsSelected() reflects selection toggled via toggleRow()', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    expect(component.rowIsSelected(TEST_ROWS[0])).toBeFalse();

    component.toggleRow(TEST_ROWS[0], true);
    expect(component.rowIsSelected(TEST_ROWS[0])).toBeTrue();
    expect(component.selectedIdsComputed()).toEqual([1]);

    // No-op when toggled to existing state
    component.toggleRow(TEST_ROWS[0], true);
    expect(component.selectedIdsComputed()).toEqual([1]);

    // Deselect
    component.toggleRow(TEST_ROWS[0], false);
    expect(component.rowIsSelected(TEST_ROWS[0])).toBeFalse();
    expect(component.selectedIdsComputed()).toEqual([]);
  });

  it('toggleSelectAll(true) selects across entire filtered dataset (not just visible page)', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    component.toggleSelectAll(true);
    const expected = new Set(TEST_ROWS.map((r) => r.id));
    expect(new Set(component.selectedIdsComputed())).toEqual(expected);

    // And deselect all
    component.toggleSelectAll(false);
    expect(component.selectedIdsComputed()).toEqual([]);
  });

  it('clearSelection() empties the selection set', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    component.toggleSelectAll(true);
    expect(component.selectedIdsComputed().length).toBe(TEST_ROWS.length);
    component.clearSelection();
    expect(component.selectedIdsComputed().length).toBe(0);
  });

  it('existingSelection seeds selection and emits selectionChanged with ids and rows', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    const emitted: Array<{
      selectedIds: Set<AbstractSelectableTableRowIdType>;
      selectedRows: Array<{ id: number; name: string }>;
    }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.selectionChanged.subscribe((e) => emitted.push(e as any));

    component.existingSelection = [2, 5];

    expect(new Set(component.selectedIdsComputed())).toEqual(new Set([2, 5]));
    expect(emitted.length).toBe(1);
    expect(new Set(emitted[0].selectedIds as unknown as number[])).toEqual(new Set([2, 5]));
    const emittedRowIds = new Set(emitted[0].selectedRows.map((r) => r.id));
    expect(emittedRowIds).toEqual(new Set([2, 5]));
  });

  it('prunes selection when data changes (effect)', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    component.existingSelection = [1, 2, 99]; // 99 is not in dataset
    // After seeding, the effect will prune on data change

    // remove row id=1 and id=99 by replacing dataset with [2..3]
    const NEW_ROWS = TEST_ROWS.slice(1, 3); // ids 2,3
    component.setTableData(NEW_ROWS);
    component.onApplyFilters();

    expect(new Set(component.selectedIdsComputed())).toEqual(new Set([2]));
  });

  it('isAllVisibleSelected() reflects only the current page slice', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    // With no selection
    expect(component.isAllVisibleSelected()).toBeFalse();

    // Select all (across all rows) -> visible page (ids 1..2) will both be selected
    component.toggleSelectAll(true);
    expect(component.isAllVisibleSelected()).toBeTrue();

    // Deselect one visible row
    component.toggleRow(TEST_ROWS[0], false);
    expect(component.isAllVisibleSelected()).toBeFalse();
  });

  it('existingSelection ignores null/undefined and does not emit', () => {
    if (!component) {
      fail('component is null');
      return;
    }
    const emitted: unknown[] = [];
    component.selectionChanged.subscribe((e) => emitted.push(e));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.existingSelection = null as unknown as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.existingSelection = undefined as unknown as any;

    expect(emitted.length).toBe(0);
  });

  it('toggleRow does not emit when state does not change (idempotent)', () => {
    if (!component) {
      fail('component is null');
      return;
    }
    const emitted: unknown[] = [];
    component.selectionChanged.subscribe((e) => emitted.push(e));

    component.toggleRow(TEST_ROWS[0], true); // emit once
    expect(emitted.length).toBe(1);

    component.toggleRow(TEST_ROWS[0], true); // no-op
    expect(emitted.length).toBe(1);

    component.toggleRow(TEST_ROWS[0], false); // emit again
    expect(emitted.length).toBe(2);
  });

  it('toggleSelectAll does not emit when selection is already at target state', () => {
    if (!component) {
      fail('component is null');
      return;
    }
    const emitted: unknown[] = [];
    component.selectionChanged.subscribe((e) => emitted.push(e));

    component.toggleSelectAll(true); // emit once
    expect(emitted.length).toBe(1);

    component.toggleSelectAll(true); // no-op
    expect(emitted.length).toBe(1);

    component.toggleSelectAll(false); // emit again
    expect(emitted.length).toBe(2);

    component.toggleSelectAll(false); // no-op
    expect(emitted.length).toBe(2);
  });

  it('clearSelection on empty selection is a no-op (no emit)', () => {
    if (!component) {
      fail('component is null');
      return;
    }
    const emitted: unknown[] = [];
    component.selectionChanged.subscribe((e) => emitted.push(e));

    component.clearSelection();
    expect(emitted.length).toBe(0);
  });

  it('selectedCountVisible and selectedCountFiltered compute correct values', () => {
    if (!component) {
      fail('component is null');
      return;
    }

    // Initially none selected
    expect(component.selectedCountVisible()).toBe(0);
    expect(component.selectedCountFiltered()).toBe(0);

    // Select all (across filtered dataset)
    component.toggleSelectAll(true);

    // itemsPerPageSignal was set to 2 in the test component constructor
    expect(component.selectedCountVisible()).toBe(2);
    expect(component.selectedCountFiltered()).toBe(TEST_ROWS.length);

    // Deselect one visible row (id 1)
    component.toggleRow(TEST_ROWS[0], false);
    expect(component.selectedCountVisible()).toBe(1);
    expect(component.selectedCountFiltered()).toBe(TEST_ROWS.length - 1);
  });

  it('visibleRows returns the current page slice', () => {
    if (!component) {
      fail('component is null');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = component.visibleRows().map((r: any) => r.id);
    expect(ids).toEqual([1, 2]);
  });

  it('selectedRowsComputed returns the selected row objects', () => {
    if (!component) { fail('component is null'); return; }

    component.toggleRow(TEST_ROWS[0], true); // id 1
    component.toggleRow(TEST_ROWS[2], true); // id 3

    const rows = component.selectedRowsComputed();
    const ids = rows.map((r: any) => r.id);
    expect(new Set(ids)).toEqual(new Set([1, 3]));
  });

  it('isAllVisibleSelected() returns false when there are no visible rows', () => {
    if (!component) { fail('component is null'); return; }

    // Make page size 0 so visible slice is empty
    component.itemsPerPageSignal.set(0);
    expect(component.visibleRows().length).toBe(0);
    expect(component.isAllVisibleSelected()).toBeFalse();
  });

  it('toggleRow is a no-op when deselecting an unselected row (branch coverage)', () => {
    if (!component) { fail('component is null'); return; }

    // Ensure the row is not selected
    expect(component.rowIsSelected(TEST_ROWS[1])).toBeFalse();

    const spy = spyOn(component.selectionChanged, 'emit');
    component.toggleRow(TEST_ROWS[1], false); // deselect an unselected row

    expect(component.selectedIdsComputed()).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });
});
