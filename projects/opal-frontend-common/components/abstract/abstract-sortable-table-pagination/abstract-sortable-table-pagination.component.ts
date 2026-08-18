import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  Input,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  private readonly injector = inject(Injector);
  private readonly paginationFocusUtilsService = inject(UtilsService);
  @ViewChildren('paginationFocusTarget', { read: ElementRef })
  private paginationFocusTargets!: QueryList<ElementRef<HTMLElement>>;

  /**
   * Keeps the current page within the available range when the data set or page size changes.
   */
  private readonly clampCurrentPageEffect = effect(() => {
    const totalPages = Math.max(1, Math.ceil(this.sortedTableDataSignal().length / this.itemsPerPageSignal()));

    if (this.currentPageSignal() > totalPages) {
      this.currentPageSignal.set(totalPages);
    }
  });

  // Signal for the current page. Used to calculate the start and end indices for pagination.
  public currentPageSignal = signal(1);

  // Signal for the number of items per page. Determines how many items are displayed on each page.
  public itemsPerPageSignal = signal(10);

  // Optional page title included in the announcement exposed to the consuming template.
  @Input({ required: false }) public paginationPageTitle = '';

  // Announcement for a consuming template to render in a live status region.
  public readonly pageChangeAnnouncement = signal('');

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
   * Focuses the first target rendered for the new page and lets the browser scroll it into view.
   * Falls back to the main content landmark when the table has no marked focus target.
   */
  private focusNewPageContent(): void {
    const focusTarget = this.paginationFocusTargets.first?.nativeElement;

    if (focusTarget) {
      const hasTabindex = focusTarget.hasAttribute('tabindex');

      if (!hasTabindex) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
      }

      focusTarget.focus();
      return;
    }

    this.paginationFocusUtilsService.focusAndScrollToTop();
  }

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
   * Moves focus to the first marked target, or the main content fallback, after committing a different page.
   *
   * @param newPage - The new page number to set. If the provided page number is out of range,
   * it will be clamped between 1 and the total number of pages.
   */
  public onPageChange(newPage: number): void {
    const totalPages = Math.ceil(this.sortedTableDataSignal().length / this.itemsPerPageSignal());
    const nextPage = Math.max(1, Math.min(newPage, totalPages));

    if (nextPage === this.currentPageSignal()) {
      return;
    }

    const pageTitle = this.paginationPageTitle.trim();
    const pageContext = `${nextPage} of ${totalPages}`;
    this.pageChangeAnnouncement.set(pageTitle ? `${pageTitle}, page ${pageContext}` : `Page ${pageContext}`);
    this.currentPageSignal.set(nextPage);
    afterNextRender(
      {
        mixedReadWrite: () => this.focusNewPageContent(),
      },
      { injector: this.injector },
    );
  }
}
