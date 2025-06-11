import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-selected',
  imports: [],
  templateUrl: './moj-filter-selected.component.html',
})
export class MojFilterSelectedComponent {
  @Output() clearFilters = new EventEmitter<void>();

  /**
   * Clears the selected tag filter.
   *
   * If an event is provided, this method prevents its default behavior to avoid unintended side effects.
   * It then emits the `clearFilters` event to reset the applied filters.
   *
   * @param event - An optional event that triggered the clear action.
   */
  clearTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.clearFilters.emit();
  }
}
