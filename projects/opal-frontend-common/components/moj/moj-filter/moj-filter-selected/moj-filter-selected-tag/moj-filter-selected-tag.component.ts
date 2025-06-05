import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFilterOption } from '../../interfaces/filter-interfaces';

@Component({
  selector: 'app-moj-filter-selected-tag',
  imports: [],
  templateUrl: './moj-filter-selected-tag.component.html',
})
export class MojFilterSelectedTagComponent {
  @Input() FilterData: Array<{
    categoryName: string;
    options: IFilterOption[];
  }> = [];

  @Output() removeTagClicked = new EventEmitter<string>();

  removeTag(label: string): void {
    this.removeTagClicked.emit(label);
  }
}
