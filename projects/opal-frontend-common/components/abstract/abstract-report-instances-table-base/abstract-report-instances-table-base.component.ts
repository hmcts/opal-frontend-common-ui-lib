import { Component, computed, Input, signal } from '@angular/core';
import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';

@Component({ template: '' })
export abstract class AbstractReportInstancesTableBaseComponent<
  TTableData extends IAbstractTableData<SortableValuesType>,
> extends AbstractSortableTablePaginationComponent {
  @Input({ required: true }) set tableData(tableData: TTableData[]) {
    this.setTableData(tableData);
    this.onApplyFilters();
  }

  @Input() set itemsPerPage(itemsPerPage: number) {
    this.itemsPerPageSignal.set(itemsPerPage);
  }

  public override itemsPerPageSignal = signal(25);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as TTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
}
