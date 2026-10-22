import { NgTemplateOutlet } from '@angular/common';
import { ICustomFileInterfaceViewerActionTemplateContext } from './interfaces/custom-file-interface-viewer-action-template-context.interface';
import { CUSTOM_FILE_INTERFACE_VIEWER_ITEMS_PER_PAGE } from './constants/custom-file-interface-viewer-items-per-page.constant';
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
import { ICustomFileInterfaceViewerTableData } from '../interfaces/custom-file-interface-viewer-table-data.interface';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';

/**
 * Renders prepared inbound or outbound rows with inherited sorting and 25-row pagination.
 * Optional consumer templates own row actions; the table does not fetch or download files.
 */
@Component({
  selector:
    'opal-lib-custom-file-interface-viewer-table-wrapper, opal-lib-custom-file-interface-viewer-inbound-table-wrapper',
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
  templateUrl: './custom-file-interface-viewer-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerTableWrapperComponent extends AbstractReportInstancesTableBaseComponent<ICustomFileInterfaceViewerTableData> {
  @Input() public isInbound: boolean = true;

  @Input()
  public actionTemplate: TemplateRef<ICustomFileInterfaceViewerActionTemplateContext> | null = null;

  /**
   * Applies the supplied sorting configuration to the inherited table state.
   *
   * @param existingSortState - Sorting configuration, or null when none is supplied.
   */
  @Input({ required: true }) set existingSortState(existingSortState: IAbstractSortState | null) {
    this.abstractExistingSortState = existingSortState;
  }
  public override itemsPerPageSignal = signal(CUSTOM_FILE_INTERFACE_VIEWER_ITEMS_PER_PAGE);
}
