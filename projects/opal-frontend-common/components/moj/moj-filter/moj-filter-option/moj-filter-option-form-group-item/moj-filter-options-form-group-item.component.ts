import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFilterOption } from '../../interfaces/filter-interfaces';

@Component({
  selector: 'app-moj-filter-options-form-group-item',
  imports: [],
  templateUrl: './moj-filter-option-form-group-item.component.html',
})
export class MojFilterOptionsFormGroupComponent {
  @Input() options!: {
    categoryName: string;
    options: IFilterOption[];
  };
  @Output() changed = new EventEmitter<IFilterOption>();

  onCheckboxChange(event: Event, item: IFilterOption): void {
    const input = event.target as HTMLInputElement;
    item.selected = input.checked;
    this.changed.emit(item);
  }
}
