import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-moj-multi-select-checkbox-head',
  imports: [],
  templateUrl: './moj-multi-select-checkbox-head.component.html',
})
export class MojMultiSelectCheckboxComponentHead implements AfterViewInit, OnChanges {
  @Input() inputId: string = 'select-all';
  @Input() extraClasses: string = '';
  @Input() selectAllChecked: boolean = false;
  @Input() selectAllIndeterminate: boolean = false;
  @Input() ariaLabel: string = 'Select all rows';

  @ViewChild('selectAllInput') private selectAllInput?: ElementRef<HTMLInputElement>;

  @Output() toggleAll = new EventEmitter<boolean>();

  public ngAfterViewInit(): void {
    this.syncIndeterminateState();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectAllIndeterminate']) {
      this.syncIndeterminateState();
    }
  }

  public toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleAll.emit(isChecked);
  }

  private syncIndeterminateState(): void {
    if (this.selectAllInput) {
      this.selectAllInput.nativeElement.indeterminate = this.selectAllIndeterminate;
    }
  }
}
