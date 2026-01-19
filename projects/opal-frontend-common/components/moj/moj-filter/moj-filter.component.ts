import { Component, Input } from '@angular/core';

let nextFilterId = 0;

@Component({
  selector: 'opal-lib-moj-filter',
  standalone: true,
  templateUrl: './moj-filter.component.html',
})
export class MojFilterComponent {
  @Input({ required: false }) public showFilter = false;
  @Input({ required: false }) public filterId = `moj-filter-${++nextFilterId}`;

  /**
   * Toggles the visibility of the filter panel.
   *
   * This method inverts the current value of `showFilter`, effectively
   * showing the filter panel if it is hidden, or hiding it if it is visible.
   */
  public toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }
}
