import { ChangeDetectionStrategy, Component, computed, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { ICustomFileInterfaceViewerInboundTableWrapperTableSort } from './interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-sort.interface';

@Component({
  selector: 'opal-lib-custom-file-interface-viewer-inbound-table-wrapper',
  imports: [
    MojPaginationComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    CustomHorizontalScrollPaneComponent,
  ],
  templateUrl: './custom-file-interface-viewer-inbound-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerInboundTableWrapperComponent
  extends AbstractSortableTablePaginationComponent
  implements OnChanges
{
  @Input() public tableData: ICustomFileInterfaceViewerInboundTableWrapperTableData[] = [];

  @Input({ required: true }) set existingSortState(
    existingSortState: ICustomFileInterfaceViewerInboundTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as ICustomFileInterfaceViewerInboundTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  public override itemsPerPageSignal = signal(25);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.setTableData(this.tableData);
      this.onApplyFilters();
    }
  }
}
