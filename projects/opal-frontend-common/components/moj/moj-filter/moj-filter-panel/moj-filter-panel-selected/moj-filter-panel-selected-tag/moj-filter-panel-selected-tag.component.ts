import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IAbstractTableFilterCategory } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/interfaces';
@Component({
  selector: 'opal-lib-moj-filter-panel-selected-tag',
  templateUrl: './moj-filter-panel-selected-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelSelectedTagComponent {
  @Input() filterData: IAbstractTableFilterCategory[] = [];
  @Input({ required: false }) ariaLabelPrefix = 'Remove this filter';
  @Output() removeTagClicked = new EventEmitter<{ categoryName: string; optionValue: string | number }>();

  /**
   * Removes the tag with the specified label.
   *
   * This method emits an event to signal that the tag related to the provided label should be removed.
   *
   * @param label - The label of the tag to remove.
   */
  public removeTag(categoryName: string, optionValue: string | number, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.removeTagClicked.emit({ categoryName, optionValue });
  }
}
