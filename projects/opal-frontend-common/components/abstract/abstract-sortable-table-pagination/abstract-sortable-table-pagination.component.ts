import { Component, computed, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';

@Component({
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  // Signal for the current page. Used to calculate the start and end indices for pagination.
  public currentPageSignal = signal(1);

  // Signal for the number of items per page. Determines how many items are displayed on each page.
  public itemsPerPageSignal = signal(10);

  // Signal for the start index (1-based). Automatically updates when `currentPageSignal` or `itemsPerPageSignal` changes.
  public startIndexComputed = computed(() => {
    const currentPage = this.currentPageSignal();
    return (currentPage - 1) * this.itemsPerPageSignal() + 1;
  });

  /**
   * Computes the end index for the current page of the sorted table data.
   * Ensures the end index does not exceed the total number of items.
   *
   * @returns The zero-based index of the last item to display on the current page.
   */
  public endIndexComputed = computed(() => {
    return Math.min(this.sortedTableDataSignal().length, this.startIndexComputed() + this.itemsPerPageSignal() - 1);
  });

  // Computed signal for paginated table data. Reactively slices `displayTableDataSignal` based on `startIndexComputed` and `endIndexComputed`.
  public paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal(); // Full table data

    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed()); // Return paginated data subset
  });

  /**
   * Handles sorting changes and resets the page to the first page.
   *
   * @param event - The sorting event containing:
   *   - `key`: The column key to sort by.
   *   - `sortType`: The sorting order, either 'ascending' or 'descending'.
   *
   * Resets `currentPageSignal` to 1 and triggers re-sorting of `displayTableDataSignal`.
   */
  public override onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    super.onSortChange(event); // Update the sort state and sort the data
    this.currentPageSignal.set(1); // Reset the page to the first page
  }

  /**
   * Applies the current filters to the table data.
   *
   * Overrides the base implementation to additionally reset the pagination to the first page
   * after filters are applied.
   *
   * @override
   */
  public override onApplyFilters(): void {
    super.onApplyFilters();
    this.currentPageSignal.set(1); // Reset to first page after filtering
  }

  /**
   * Handles the event when the page is changed.
   *
   * @param newPage - The new page number to set. If the provided page number is out of range,
   * it will be clamped between 1 and the total number of pages.
   */
  public onPageChange(newPage: number): void {
    const totalPages = Math.ceil(this.displayTableDataSignal().length / this.itemsPerPageSignal());
    this.currentPageSignal.set(Math.max(1, Math.min(newPage, totalPages)));
  }
}
