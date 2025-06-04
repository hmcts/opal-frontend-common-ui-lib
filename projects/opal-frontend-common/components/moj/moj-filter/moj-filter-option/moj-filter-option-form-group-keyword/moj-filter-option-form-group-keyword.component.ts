import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-moj-filter-option-form-group-keyword',
  imports: [],
  templateUrl: './moj-filter-option-form-group-keyword.component.html',
})
export class MojFilterOptionFormGroupKeywordComponent {
  @Output() keywordChange = new EventEmitter<string>();

  onKeywordChange(event: Event): void {
    const keyword = (event.target as HTMLInputElement).value;
    this.keywordChange.emit(keyword);
  }
}
