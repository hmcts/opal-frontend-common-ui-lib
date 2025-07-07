import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-panel-option',
  templateUrl: './moj-filter-panel-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelOptionComponent {
  @Input({ required: false }) buttonText = 'Apply filters';
  @Output() applyFilters = new EventEmitter<void>();

  /**
   * Emits the applyFilters event.
   *
   * This method triggers the emission of the applyFilters event to notify
   * any subscribers that the filter criteria have been applied.
   */
  public onApplyFilters(): void {
    this.applyFilters.emit();
  }
}
