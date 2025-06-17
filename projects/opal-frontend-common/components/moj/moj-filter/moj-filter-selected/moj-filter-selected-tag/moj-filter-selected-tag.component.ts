import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFilterSelectedTagGroup } from '@hmcts/opal-frontend-common/components/abstract/abstract-filter';
@Component({
  selector: 'opal-lib-moj-filter-selected-tag',
  imports: [],
  templateUrl: './moj-filter-selected-tag.component.html',
})
export class MojFilterSelectedTagComponent {
  @Input() filterData: IFilterSelectedTagGroup[] = [];
  @Input({ required: false }) ariaLabelPrefix = 'Remove this filter';
  @Output() removeTagClicked = new EventEmitter<string>();

  /**
   * Removes the tag with the specified label.
   *
   * This method emits an event to signal that the tag related to the provided label should be removed.
   *
   * @param label - The label of the tag to remove.
   */
  removeTag(label: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.removeTagClicked.emit(label);
  }
}
