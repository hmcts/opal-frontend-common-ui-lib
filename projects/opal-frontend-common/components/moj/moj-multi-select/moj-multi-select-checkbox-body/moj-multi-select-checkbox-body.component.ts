import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MultiSelectRowIdentifier } from '../types/moj-multi-select.types';

@Component({
  selector: 'app-moj-multi-select-checkbox-body',
  imports: [],
  templateUrl: './moj-multi-select-checkbox-body.component.html',
})
export class MojMultiSelectCheckboxComponentBody {
  @Input() inputId!: string;
  @Input() extraClasses: string = '';
  @Input() isChecked: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() ariaLabel: string = '';
  @Input() rowId!: MultiSelectRowIdentifier;

  @Output() selectionChange = new EventEmitter<{ rowId: MultiSelectRowIdentifier; checked: boolean }>();

  public get rowAriaLabel(): string {
    return this.ariaLabel || `Select row ${this.rowIndex + 1}`;
  }

  public toggleRowSelection(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectionChange.emit({ rowId: this.rowId, checked: isChecked });
  }
}
