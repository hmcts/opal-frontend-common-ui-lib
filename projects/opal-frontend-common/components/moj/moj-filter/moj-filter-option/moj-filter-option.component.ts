import { Component , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-moj-filter-option',
  imports: [],
  templateUrl: './moj-filter-option.component.html',
})
export class MojFilterOptionComponent {
  @Output() applyFilters = new EventEmitter<void>(); 

  onApplyFilters(): void {
    this.applyFilters.emit();
  }
}
