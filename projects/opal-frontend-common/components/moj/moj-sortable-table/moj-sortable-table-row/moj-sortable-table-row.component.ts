import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-sortable-table-row,[opal-lib-moj-sortable-table-row]',
  imports: [],
  templateUrl: './moj-sortable-table-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableRowComponent {
  @Input({ required: false }) public bodyRowClasses: string = '';
  @HostBinding('class') get hostClass() {
    return `govuk-table__row ${this.bodyRowClasses}`;
  }
}
