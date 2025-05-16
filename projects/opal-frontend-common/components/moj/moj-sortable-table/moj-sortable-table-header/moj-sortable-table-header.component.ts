import { Component, HostBinding, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { MojSortableTableHeaderSortIconDirective } from './directive/moj-sortable-table-header-sort-icon.directive';

@Component({
  selector: 'opal-lib-moj-sortable-table-header, [opal-lib-moj-sortable-table-header]',
  templateUrl: './moj-sortable-table-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MojSortableTableHeaderSortIconDirective],
})
export class MojSortableTableHeaderComponent {
  @Input() columnKey!: string;
  @Input() sortDirection: 'ascending' | 'descending' | 'none' = 'none';
  @Input() dataIndex: number = 0;

  @Output() sortChange = new EventEmitter<{ key: string; sortType: 'ascending' | 'descending' }>();

  @HostBinding('attr.aria-sort') get ariaSort(): string | null {
    return this.sortDirection;
  }

  @HostBinding('scope') hostScope = 'col';

  @HostBinding('class') get hostClass(): string {
    return 'govuk-table__header';
  }

  /**
   * Toggles the sort direction between 'ascending' and 'descending' for the table column.
   * Emits a sortChange event with the column key and the new sort direction.
   *
   * @public
   * @returns {void}
   */
  public toggleSort(): void {
    const newDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';

    this.sortChange.emit({
      key: this.columnKey,
      sortType: newDirection,
    });
  }
}
