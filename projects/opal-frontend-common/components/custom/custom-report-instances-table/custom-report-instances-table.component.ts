import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { CUSTOM_REPORT_INSTANCES_TABLE_COLUMN } from './constants/custom-report-instances-table-column.constant';
import { CUSTOM_REPORT_INSTANCES_TABLE_SORT_DEFAULT } from './constants/custom-report-instances-table-sort-default.constant';
import { ICustomReportInstancesTableAction } from './interfaces/custom-report-instances-table-action.interface';
import { ICustomReportInstancesTableData } from './interfaces/custom-report-instances-table-data.interface';
import { ICustomReportInstancesTableSort } from './interfaces/custom-report-instances-table-sort.interface';

@Component({
  selector: 'opal-lib-custom-report-instances-table',
  imports: [
    CommonModule,
    CustomHorizontalScrollPaneComponent,
    MojPaginationComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
  ],
  templateUrl: './custom-report-instances-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomReportInstancesTableComponent extends AbstractSortableTablePaginationComponent {
  @Input({ required: true }) set tableData(tableData: ICustomReportInstancesTableData[]) {
    this.setTableData(tableData);
    this.onApplyFilters();
  }

  @Input({ required: false }) public caption = 'Report instances';
  @Input({ required: false }) public paginationId = 'report-instances-pagination';

  @Output() public instanceSelected = new EventEmitter<ICustomReportInstancesTableData>();
  @Output() public actionSelected = new EventEmitter<ICustomReportInstancesTableAction>();

  public readonly tableColumns = CUSTOM_REPORT_INSTANCES_TABLE_COLUMN;

  @Input({ required: false }) set existingSortState(existingSortState: ICustomReportInstancesTableSort | null) {
    this.abstractExistingSortState = existingSortState ?? CUSTOM_REPORT_INSTANCES_TABLE_SORT_DEFAULT;
  }

  public override itemsPerPageSignal = signal(25);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as ICustomReportInstancesTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  constructor() {
    super();
    this.abstractExistingSortState = CUSTOM_REPORT_INSTANCES_TABLE_SORT_DEFAULT;
  }

  /**
   * Handles selection of a report instance row.
   *
   * Prevents the placeholder link navigation and emits the selected row so consuming applications
   * can decide how to open the report instance.
   *
   * @param event - The click event from the selected report instance link.
   * @param row - The selected report instance row data.
   */
  public onInstanceSelected(event: Event, row: ICustomReportInstancesTableData): void {
    event.preventDefault();
    this.instanceSelected.emit(row);
  }

  /**
   * Handles selection of a report instance action.
   *
   * Prevents the placeholder link navigation and emits the selected row with the action label so
   * consuming applications can decide how to process the action.
   *
   * @param event - The click event from the selected action link.
   * @param row - The report instance row associated with the selected action.
   * @param actionLabel - The selected action label.
   */
  public onActionSelected(event: Event, row: ICustomReportInstancesTableData, actionLabel: string): void {
    event.preventDefault();
    this.actionSelected.emit({ row, actionLabel });
  }
}
