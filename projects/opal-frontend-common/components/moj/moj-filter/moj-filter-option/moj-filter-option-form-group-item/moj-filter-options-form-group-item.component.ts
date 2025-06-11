import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFilterOption } from '../../interfaces/filter-interfaces';

@Component({
  selector: 'opal-lib-moj-filter-options-form-group-item',
  imports: [],
  templateUrl: './moj-filter-option-form-group-item.component.html',
})
export class MojFilterOptionsFormGroupItemComponent {
  @Input() options!: {
    categoryName: string;
    options: IFilterOption[];
  };
  @Output() changed = new EventEmitter<IFilterOption>();

  /**
   * Handles a change in the checkbox state.
   *
   * This method updates the selected property of the given filter option based on the
   * current state of the checkbox element derived from the event. It then emits the
   * changed filter option to notify listeners of the update.
   *
   * @param event - The event object triggered by the checkbox change.
   * @param item - The filter option item whose selected state needs to be updated.
   */
  onCheckboxChange(item: IFilterOption, event?: Event): void {
    if (event) {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      item.selected = input.checked;
    }

    this.changed.emit(item);
  }
}
