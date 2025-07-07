import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-panel-selected',
  templateUrl: './moj-filter-panel-selected.component.html',
  styleUrls: ['./moj-filter-panel-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelSelectedComponent {
  @Input({ required: false }) headingLabel = 'Selected filters';
  @Input({ required: false }) linkLabel = 'Clear filters';
  @Output() clearFilters = new EventEmitter<void>();

  /**
   * Clears the selected tag filter.
   *
   * If an event is provided, this method prevents its default behavior to avoid unintended side effects.
   * It then emits the `clearFilters` event to reset the applied filters.
   *
   * @param event - An optional event that triggered the clear action.
   */
  public clearTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.clearFilters.emit();
  }
}
