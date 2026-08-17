import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-pagination',
  templateUrl: './moj-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPaginationComponent implements OnChanges {
  private readonly pages = signal<number[]>([]);

  @Input({ required: true }) id!: string;
  @Input({ required: true }) currentPage: number = 1;
  @Input({ required: true }) total: number = 0;
  @Input({ required: true }) limit: number = 25;
  @Output() changePage = new EventEmitter<number>();

  public readonly elipsedPages = signal<(number | string)[]>([]);
  public readonly ELIPSIS = '…';

  /**
   * Gets the total number of pages available.
   *
   * @returns The total count of pages as a number.
   */
  get totalPages(): number {
    return this.pages().length;
  }

  /**
   * Gets the starting item index for the current page in a paginated list.
   *
   * @returns {number} The index of the first item on the current page, or 0 if there are no items.
   *
   * If `total` is 0, returns 0. Otherwise, calculates the starting index based on the current page and the limit per page.
   */
  get pageStart(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.limit + 1;
  }

  /**
   * Gets the index of the last item on the current page.
   *
   * @returns {number} The index of the last item displayed on the current page.
   * Returns 0 if there are no items (`total` is 0). Otherwise, returns the lesser of
   * `currentPage * limit` and `total`, ensuring the end index does not exceed the total number of items.
   */
  get pageEnd(): number {
    return this.total === 0 ? 0 : Math.min(this.currentPage * this.limit, this.total);
  }

  /**
   * Calculates and updates the pagination pages and elided (skipped) pages based on the current limit and total items.
   *
   * - If either `limit` or `total` is less than or equal to zero, clears the pages and elided pages.
   * - Otherwise, computes the total number of pages, updates the `pages` observable with the full range,
   *   and updates the `elipsedPages` observable with the result of skipping pages for ellipsis display.
   *
   * @private
   */
  private calculatePages() {
    if (this.limit <= 0 || this.total <= 0) {
      this.pages.set([]);
      this.elipsedPages.set([]);
      return;
    }
    const pagesCount = Math.ceil(this.total / this.limit);
    this.pages.set(this.range(1, pagesCount + 1));
    this.elipsedPages.set(this.elipseSkippedPages(this.pages(), this.currentPage));
  }

  /**
   * Generates an array of numbers starting from `start` up to, but not including, `end`.
   *
   * @param start - The starting number of the range (inclusive).
   * @param end - The ending number of the range (exclusive).
   * @returns An array of numbers from `start` to `end - 1`.
   */
  private range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  /**
   * Generates a pagination array with ellipses ("...") to represent skipped page ranges.
   *
   * The resulting array always includes the first and last page numbers, the current page,
   * and up to one page before and after the current page. Ellipses are inserted where
   * there are skipped ranges between the displayed pages.
   *
   * @param pages - An array of page numbers representing all available pages.
   * @param currentPage - The currently active page number.
   * @returns An array containing page numbers and ellipsis strings ("...") to indicate skipped pages.
   */
  private elipseSkippedPages(pages: number[], currentPage: number): (number | string)[] {
    const totalPages = pages.length;
    const first = 1;
    const last = totalPages;

    const result: (number | string)[] = [];

    // Always show the first page
    result.push(first);

    // Determine left-side ellipsis
    if (currentPage > first + 2) {
      result.push(this.ELIPSIS);
    }

    // Middle pages: current - 1, current, current + 1
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > first && i < last) {
        result.push(i);
      }
    }

    // Decide whether to add right-side ellipsis
    const lastIncluded = result.includes(last);
    const secondLast = last - 1;
    if (!result.includes(secondLast) && !lastIncluded) {
      result.push(this.ELIPSIS);
    }

    // Add last page if not already included
    if (!lastIncluded && last !== first) {
      result.push(last);
    }

    return result;
  }

  /**
   * Handles the page change event for the pagination component.
   *
   * Prevents the default action of the event (if provided) and emits the selected page number.
   *
   * @param event - The event triggered by the page change action. If provided, its default behavior will be prevented.
   * @param page - The page number to navigate to.
   */
  public onPageChanged(event: Event, page: number): void {
    if (event) {
      event.preventDefault();
    }
    if (page === this.currentPage) {
      return;
    }
    this.changePage.emit(page);
  }

  /**
   * Lifecycle hook that is called when any data-bound property of the component changes.
   * Invokes the `calculatePages` method to update the pagination state based on the new input values.
   */
  public ngOnChanges(): void {
    this.calculatePages();
  }
}
