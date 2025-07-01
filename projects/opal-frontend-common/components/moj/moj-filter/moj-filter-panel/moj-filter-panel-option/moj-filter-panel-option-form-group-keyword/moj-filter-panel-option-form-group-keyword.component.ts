import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-panel-option-form-group-keyword',
  templateUrl: './moj-filter-panel-option-form-group-keyword.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelOptionFormGroupKeywordComponent {
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
  public onKeywordChange(event?: Event): void {
    let keyword = '';
    if (event) {
      keyword = (event.target as HTMLInputElement).value;
    }

    this.keywordChange.emit(keyword);
  }
}
