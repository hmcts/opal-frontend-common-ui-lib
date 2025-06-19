import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-option',
  imports: [],
  templateUrl: './moj-filter-option.component.html',
})
export class MojFilterOptionComponent {
  @Input({ required: false }) buttonText = 'Apply filters';
  @Output() applyFilters = new EventEmitter<void>();

  /**
   * Emits the applyFilters event.
   *
   * This method triggers the emission of the applyFilters event to notify
   * any subscribers that the filter criteria have been applied.
   */
  onApplyFilters(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.applyFilters.emit();
  }
}
