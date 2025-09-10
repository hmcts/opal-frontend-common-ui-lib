import { Input, Output, EventEmitter, computed, signal, WritableSignal, Component, effect } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { AbstractSelectableTableRowIdType } from './types/abstract-selectable-table-row-id.type';
import { IAbstractSelectableTableSelectionPayload } from './interfaces/abstract-selectable-table-selection-payload.interface';

/**
 * Adds multi-select behaviour (row selection + select-all) on top of
 * the sortable + paginated table base. Framework-agnostic via accessors.
 *
 * - "Select all" always selects across all rows currently available on the client (entire filtered dataset, all pages).
 * - Selection is pruned when data changes (e.g., filters remove rows).
 * - Emits selectionChanged with both ids and row objects.
 */
@Component({
  template: '',
})
export abstract class AbstractSelectableTableComponent extends AbstractSortableTablePaginationComponent {
  /** Internal selection store */
  protected selectedIds: WritableSignal<Set<AbstractSelectableTableRowIdType>> = signal(
    new Set<AbstractSelectableTableRowIdType>(),
  );

  /**
   * * Effect: whenever the filtered/sorted data changes, prune selection to existing rows.
   * This covers data refreshes outside explicit filter application.
   */
  protected readonly pruneOnDataChangeEffect = effect(() => {
    // Track dependencies
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dep = this.sortedTableDataSignal();
    // Prune without emitting unless selection actually changed
    this.pruneSelectionToExistingRows();
  });

  /** Fires whenever the selection set changes */
  @Output() selectionChanged = new EventEmitter<IAbstractSelectableTableSelectionPayload>();

  /** Selected ids as a computed array (useful for templates/tests). */
  public selectedIdsComputed = computed<AbstractSelectableTableRowIdType[]>(() => Array.from(this.selectedIds()));

  /** Selected row objects from the currently filtered/sorted dataset. */
  public selectedRowsComputed = computed<unknown[]>(() => {
    const set = this.selectedIds();
    return this.sortedTableDataSignal().filter((r) => set.has(this.getRowId(r)));
  });

  /**
   * Gets the visible rows for the current page.
   * @returns The current paginated slice of table data.
   * @sideeffect None
   */
  public visibleRows = computed<unknown[]>(() => this.paginatedTableDataComputed());

  /**
   * Gets the count of selected rows that are currently visible (on the current page).
   * @returns The number of visible rows that are selected.
   * @sideeffect None
   */
  public selectedCountVisible = computed(() => {
    const set = this.selectedIds();
    return this.visibleRows().reduce((acc: number, r: unknown) => acc + (set.has(this.getRowId(r)) ? 1 : 0), 0);
  });

  /**
   * Gets the count of selected rows in the filtered/sorted dataset.
   * @returns The number of filtered rows that are selected.
   * @sideeffect None
   */
  public selectedCountFiltered = computed(() => {
    const set = this.selectedIds();
    return this.sortedTableDataSignal().reduce(
      (acc: number, r: unknown) => acc + (set.has(this.getRowId(r)) ? 1 : 0),
      0,
    );
  });

  /**
   * Determines if all visible rows are selected.
   * @returns True if all currently visible rows are selected, false otherwise.
   * @sideeffect None
   */
  public isAllVisibleSelected = computed(() => {
    const visible = this.visibleRows();
    if (visible.length === 0) return false;
    const set = this.selectedIds();
    return visible.every((r) => set.has(this.getRowId(r)));
  });

  /**
   * Removes any selected IDs that no longer exist in the current filtered/sorted dataset.
   * @returns void
   * @sideeffect May update selection set and emit selectionChanged if selection changed.
   */
  private pruneSelectionToExistingRows() {
    const idsInData = new Set(this.sortedTableDataSignal().map((row) => this.getRowId(row)));
    const next = new Set<AbstractSelectableTableRowIdType>();
    for (const id of this.selectedIds()) if (idsInData.has(id)) next.add(id);
    if (next.size !== this.selectedIds().size) {
      this.selectedIds.set(next);
      this.emitSelectionChanged();
    }
  }

  /**
   * Emits the selectionChanged event with the current selection.
   * @returns void
   * @sideeffect Emits selectionChanged event.
   */
  private emitSelectionChanged() {
    const set = this.selectedIds();
    const all = this.sortedTableDataSignal();
    const selectedRows = all.filter((r) => set.has(this.getRowId(r)));
    this.selectionChanged.emit({
      selectedIds: new Set(set),
      selectedRows,
    });
  }

  /**
   * Determines if a given row is selected.
   * @param row The row to check.
   * @returns True if the row is selected, false otherwise.
   * @sideeffect None
   */
  public rowIsSelected = (row: unknown) => this.selectedIds().has(this.getRowId(row));

  /** Seed existing selection (e.g., restoring state).
   * Selection will be pruned to existing rows on the next reactive tick via the pruning effect.
   */
  @Input() set existingSelection(value: Iterable<AbstractSelectableTableRowIdType> | null | undefined) {
    if (!value) return;
    this.selectedIds.set(new Set(value));
    this.emitSelectionChanged();
  }

  /**
   * Toggles selection of a single row.
   * @param row The row to toggle.
   * @param checked Whether to select (true) or deselect (false) the row.
   * @returns void
   * @sideeffect Updates selection set and emits selectionChanged.
   */
  public toggleRow(row: unknown, checked: boolean) {
    const id = this.getRowId(row);
    const prev = this.selectedIds();
    const next = new Set(prev);
    const had = next.has(id);
    if (checked && had) return;
    if (!checked && !had) return;
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedIds.set(next);
    this.emitSelectionChanged();
  }

  /**
   * Selects or deselects all rows in the current scope (page or filtered).
   * @param checked Whether to select all (true) or deselect all (false).
   * @returns void
   * @sideeffect Updates selection set and emits selectionChanged.
   */
  public toggleSelectAll(checked: boolean) {
    // Tech decision: Select All applies to the entire filtered dataset (all pages)
    const target = this.sortedTableDataSignal();

    const prev = this.selectedIds();
    const next = new Set(prev);
    if (checked) {
      for (const row of target) next.add(this.getRowId(row));
    } else {
      for (const row of target) next.delete(this.getRowId(row));
    }
    if (next.size === prev.size && [...next].every((id) => prev.has(id))) return;
    this.selectedIds.set(next);
    this.emitSelectionChanged();
  }

  /**
   * Clears all selected rows.
   * @returns void
   * @sideeffect Updates selection set and emits selectionChanged.
   */
  public clearSelection() {
    if (this.selectedIds().size === 0) return;
    this.selectedIds.set(new Set<AbstractSelectableTableRowIdType>());
    this.emitSelectionChanged();
  }

  /**
   * Called when filters are applied to the table.
   * Ensures selection is pruned to match existing rows.
   * @returns void
   * @sideeffect May update selection set and emit selectionChanged.
   */
  public override onApplyFilters(): void {
    super.onApplyFilters();
    this.pruneSelectionToExistingRows();
  }

  public abstract getRowId(row: unknown): AbstractSelectableTableRowIdType;
}
