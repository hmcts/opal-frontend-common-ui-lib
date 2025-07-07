import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { IAbstractTableFilterOption } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/interfaces';

@Component({
  selector: 'opal-lib-moj-filter-panel-options-form-group-item, [opal-lib-moj-filter-panel-options-form-group-item]',
  templateUrl: './moj-filter-panel-option-form-group-item.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelOptionFormGroupItemComponent {
  @HostBinding('class') hostClass = 'govuk-form-group';
  @Input() options!: {
    categoryName: string;
    options: IAbstractTableFilterOption[];
  };
  @Output() changed = new EventEmitter<{ categoryName: string; item: IAbstractTableFilterOption }>();

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
  public onCheckboxChange(event: Event, item: IAbstractTableFilterOption): void {
    const input = event.target as HTMLInputElement;
    const updatedItem = { ...item, selected: input.checked };
    this.changed.emit({ categoryName: this.options.categoryName, item: updatedItem });
  }
}
