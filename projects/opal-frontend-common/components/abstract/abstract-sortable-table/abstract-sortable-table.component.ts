import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import {
  IAbstractSortState,
  IAbstractTableData,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortService } from '@hmcts/opal-frontend-common/services/sort-service';
import {
  SortableValuesType,
  SortDirectionType,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

@Component({
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  private readonly sortService = inject(SortService);

  public abstractTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
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
    const initialSortState = existingSortState || this.createSortState(this.abstractTableDataSignal());

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
          this.abstractTableDataSignal(),
          key,
        ) as IAbstractTableData<SortableValuesType>[])
      : (this.sortService.sortObjectArrayDesc(
          this.abstractTableDataSignal(),
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
    this.abstractTableDataSignal.set(sortedData);

    // Emit the updated sort state
    this.abstractSortState.emit(this.sortStateSignal());
  }

  /**
   * Lifecycle hook to initialise the sort state.
   */
  public ngOnInit(): void {
    this.initialiseSortState();
  }
}
