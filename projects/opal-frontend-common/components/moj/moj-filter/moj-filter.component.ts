import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter',
  standalone: true,
  templateUrl: './moj-filter.component.html',
})
export class MojFilterComponent {
  @Input({ required: false }) public showFilter = false;

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
