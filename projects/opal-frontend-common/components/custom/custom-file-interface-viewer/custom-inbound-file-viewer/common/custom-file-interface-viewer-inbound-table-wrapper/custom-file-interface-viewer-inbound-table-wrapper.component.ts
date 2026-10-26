import { NgTemplateOutlet } from '@angular/common';
import { ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext } from './interfaces/custom-file-interface-viewer-inbound-table-wrapper-action-template-context.interface';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_ITEMS_PER_PAGE } from './constants/custom-file-interface-viewer-inbound-table-wrapper-items-per-page.constant';
import { ChangeDetectionStrategy, Component, Input, signal, TemplateRef } from '@angular/core';
import { AbstractReportInstancesTableBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-instances-table-base';
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
import { ICustomFileInterfaceViewerInboundTableWrapperTableSort } from './types/custom-file-interface-viewer-inbound-table-wrapper-table-sort.type';

@Component({
  selector: 'opal-lib-custom-file-interface-viewer-inbound-table-wrapper',
  imports: [
    NgTemplateOutlet,
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
export class CustomFileInterfaceViewerInboundTableWrapperComponent extends AbstractReportInstancesTableBaseComponent<ICustomFileInterfaceViewerInboundTableWrapperTableData> {
  @Input()
  public actionTemplate: TemplateRef<ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext> | null = null;

  /**
   * Applies the supplied sorting configuration to the inherited table state.
   *
   * @param existingSortState - Sorting configuration, or null when none is supplied.
   */
  @Input({ required: true }) set existingSortState(
    existingSortState: ICustomFileInterfaceViewerInboundTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }
  public override itemsPerPageSignal = signal(CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_ITEMS_PER_PAGE);
}
