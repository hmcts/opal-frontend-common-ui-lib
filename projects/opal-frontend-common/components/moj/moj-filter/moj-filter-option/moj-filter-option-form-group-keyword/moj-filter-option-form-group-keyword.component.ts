import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-option-form-group-keyword',
  imports: [],
  templateUrl: './moj-filter-option-form-group-keyword.component.html',
})
export class MojFilterOptionFormGroupKeywordComponent {
  @Input({ required: false }) inputId = 'keywords';
  @Input({ required: false }) inputName = 'keywords';
  @Input({ required: false }) labelValue = 'Keywords';
  @Output() keywordChange = new EventEmitter<string>();

  /**
   * Handles the keyword change event from an input element.
   *
   * This function extracts the keyword from the event target (an HTML input element) and emits the new value
   * using the `keywordChange` event emitter.
   *
   * @param event - The DOM event triggered by a change in the input element.
   */
  onKeywordChange(event?: Event): void {
    let keyword = '';
    if (event) {
      keyword = (event.target as HTMLInputElement).value;
    }

    this.keywordChange.emit(keyword);
  }
}
