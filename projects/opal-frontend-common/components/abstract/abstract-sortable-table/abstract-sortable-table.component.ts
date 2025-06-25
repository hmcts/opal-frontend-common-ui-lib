import { Component, EventEmitter, OnInit, Output, effect, inject, signal } from '@angular/core';
import {
  IAbstractSortState,
  IAbstractTableData,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortService } from '@hmcts/opal-frontend-common/services/sort-service';
import {
  SortableValuesType,
  SortDirectionType,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { AbstractTableFilterComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter';

@Component({
  template: '',
})
export abstract class AbstractSortableTableComponent extends AbstractTableFilterComponent implements OnInit {
  private readonly sortService = inject(SortService);
  public override displayTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
  public override filteredTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
  public sortedTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
  public abstractExistingSortState: IAbstractSortState | null = null;
  public sortStateSignal = signal<IAbstractSortState>({});
  public sortedColumnTitleSignal = signal<string>('');
  public sortedColumnDirectionSignal = signal<SortDirectionType>('none');

  @Output() abstractSortState = new EventEmitter<IAbstractSortState>();

  /**
   * Creates an initial sort state for a table based on the provided table data.
   *
   * @param tableData - Array of table data objects representing table rows.
   * @returns Initial sort state object with column names as keys and 'none' as values.
   */
  private createSortState(tableData: IAbstractTableData<SortableValuesType>[] | null): IAbstractSortState {
    return tableData?.length
      ? Object.keys(tableData[0]).reduce<IAbstractSortState>((state, key) => {
          state[key] = 'none';
          return state;
        }, {})
      : {};
  }
  /**
   * Initializes the sort state for the sortable table component.
   *
   * This method sets the initial sort state based on the existing sort state or creates a new one
   * if none exists. It then updates the sort state signal with the initial sort state.
   *
   * If an existing sort state is found, it iterates over each entry and triggers the sort change
   * for each key that has a sort type other than 'none'.
   *
   * @private
   * @returns {void}
   */
  private initialiseSortState(): void {
    const existingSortState = this.abstractExistingSortState;
    const initialSortState = existingSortState || this.createSortState(this.displayTableDataSignal());
    this.applyFilterState();

    this.sortStateSignal.set(initialSortState);

    if (existingSortState) {
      Object.entries(existingSortState).forEach(([key, sortType]) => {
        if (sortType !== 'none') {
          this.onSortChange({ key, sortType });
        }
      });
    }
    this.getSortedColumn();
  }

  /**
   * Updates the sort state for a given column key and sort type.
   * Resets the sort state for all other columns to 'none'.
   *
   * @param key - The column to sort by.
   * @param sortType - Sorting order ('ascending' or 'descending').
   */
  private updateSortState(key: string, sortType: 'ascending' | 'descending'): void {
    this.sortStateSignal.set(
      Object.keys(this.sortStateSignal()).reduce<IAbstractSortState>((state, columnKey) => {
        state[columnKey] = columnKey === key ? sortType : 'none';
        return state;
      }, {}),
    );
  }

  /**
   * Retrieves the sorted table data based on the specified key and sort type.
   *
   * @param key - The key of the property to sort by.
   * @param sortType - The type of sorting to apply, either 'ascending' or 'descending'.
   * @returns An array of sorted table data objects.
   */
  private getSortedTableData(
    key: string,
    sortType: 'ascending' | 'descending',
  ): IAbstractTableData<SortableValuesType>[] {
    return sortType === 'ascending'
      ? (this.sortService.sortObjectArrayAsc(
          this.filteredTableDataSignal(),
          key,
        ) as IAbstractTableData<SortableValuesType>[])
      : (this.sortService.sortObjectArrayDesc(
          this.filteredTableDataSignal(),
          key,
        ) as IAbstractTableData<SortableValuesType>[]);
  }

  /**
   * Determines the first column with a sort state other than 'none' and updates the sorted column signals accordingly.
   *
   * - If a sorted column is found, updates the `sortedColumnTitleSignal` and `sortedColumnDirectionSignal` with the column key and state.
   * - If no sorted column is found, sets the `sortedColumnTitleSignal` to an empty string and `sortedColumnDirectionSignal` to 'none'.
   *
   * @private
   * @returns {void}
   */
  private getSortedColumn(): void {
    // Find the first column that has a sort state other than 'none'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sortedColumn = Object.entries(this.sortStateSignal()).find(([_, state]) => state !== 'none');

    // If a sorted column is found, set the signal to the sorted column key and state
    if (sortedColumn) {
      const [columnKey, state] = sortedColumn;
      this.sortedColumnTitleSignal.set(columnKey);
      this.sortedColumnDirectionSignal.set(state);
    } else {
      // Otherwise, set the signal to null
      this.sortedColumnTitleSignal.set('');
      this.sortedColumnDirectionSignal.set('none');
    }
  }

  /**
   * Handles the change in sorting for the table.
   *
   * @param event - An object containing the key to sort by and the sort type.
   * @param event.key - The key of the column to sort.
   * @param event.sortType - The type of sorting to apply ('ascending' or 'descending').
   *
   * This method updates the sort state, sorts the table data based on the provided key and sort type,
   * updates the table data signal, and emits the updated sort state.
   */
  protected onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    const { key, sortType } = event;

    this.updateSortState(key, sortType);
    this.getSortedColumn();
    const sortedData = this.getSortedTableData(key, sortType);

    // Update the table data signal
    this.sortedTableDataSignal.set(sortedData);

    // Emit the updated sort state
    this.abstractSortState.emit(this.sortStateSignal());
  }

  /**
   * Synchronizes the sorted table data with the current filter and sort state.
   *
   * This effect observes changes to the filtered table data and the sort state signals.
   * If no active sort key is found (i.e., no sorting is applied), it sets the sorted table data
   * to a shallow copy of the filtered data. Otherwise, sorting logic should be applied elsewhere.
   *
   * @protected
   */
  protected syncSortedDataEffect = effect(() => {
    const filtered = this.filteredTableDataSignal();
    const currentSort = this.sortStateSignal();

    const activeSortKey = Object.keys(currentSort).find((k) => currentSort[k] !== 'none');

    if (!activeSortKey) {
      // No sort applied – use filtered data directly
      this.sortedTableDataSignal.set([...filtered]);
    }
  });

  /**
   * Retrieves the currently active sort key and its direction from the sort state.
   *
   * @returns A tuple containing the active sort key as a string and its sort direction (`SortDirectionType`),
   *          or `undefined` if no sort is currently active.
   */
  protected getActiveSortKey(): [string, SortDirectionType] | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(this.sortStateSignal()).find(([_, sort]) => sort !== 'none');
  }

  /**
   * Lifecycle hook to initialise the sort state.
   */
  public ngOnInit(): void {
    this.initialiseSortState();
  }
  /**
   * Applies the current filters to the table data and updates the sorted data accordingly.
   *
   * This method overrides the parent implementation to additionally handle sorting.
   * If there is an active sort key, it applies the corresponding sort to the filtered data.
   * If no sort key is active, it simply updates the sorted data to match the filtered data.
   *
   * @override
   */
  public override onApplyFilters(): void {
    super.onApplyFilters();

    const activeSortKey = this.getActiveSortKey();
    if (!activeSortKey) {
      this.sortedTableDataSignal.set([...this.filteredTableDataSignal()]);
    } else {
      const [key, sortType] = activeSortKey;

      if (sortType !== 'none') {
        this.onSortChange({ key, sortType });
      }
    }
  }

  /**
   * Clears all filters applied to the table and restores the data to its unfiltered state.
   * If a sort is currently active, re-applies the sort after clearing filters.
   * Otherwise, resets the sorted table data to match the filtered data.
   *
   * @override
   */
  public override clearAllFilters(): void {
    super.clearAllFilters();

    const activeSortKey = this.getActiveSortKey();
    if (!activeSortKey) {
      this.sortedTableDataSignal.set([...this.filteredTableDataSignal()]);
    } else {
      const [key, sortType] = activeSortKey;
      if (sortType !== 'none') {
        this.onSortChange({ key, sortType });
      }
    }
  }
}
