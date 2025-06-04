import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-moj-filter-selected',
  imports: [],
  templateUrl: './moj-filter-selected.component.html',
})
export class MojFilterSelectedComponent {
  @Output() clearFilters = new EventEmitter<void>();
}
