import { NgTemplateOutlet } from '@angular/common';
import { ICustomFileInterfaceViewerActionTemplateContext } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-table-wrapper/interfaces';
import { CUSTOM_FILE_INTERFACE_VIEWER_ITEMS_PER_PAGE } from './constants/custom-file-interface-viewer-items-per-page.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/constants';
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
import { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';

/**
 * Renders prepared inbound or outbound rows with inherited sorting and 25-row pagination.
 * Optional consumer templates own row actions; the table does not fetch or download files.
 */
@Component({
  selector: 'opal-lib-custom-file-interface-viewer-table-wrapper',
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
export class CustomFileInterfaceViewerTableWrapperComponent<
  TFile extends ICustomFileInterfaceViewerTableData = ICustomFileInterfaceViewerTableData,
> extends AbstractReportInstancesTableBaseComponent<TFile> {
  @Input() public isInbound: boolean = true;

  @Input()
  public actionTemplate: TemplateRef<ICustomFileInterfaceViewerActionTemplateContext<TFile>> | null = null;

  /**
   * Fills omitted sortable columns with no sort before applying the supplied configuration.
   *
   * @param existingSortState - Sorting configuration, or null to leave every column unsorted.
   */
  @Input({ required: true }) set existingSortState(existingSortState: IAbstractSortState | null) {
    this.abstractExistingSortState = {
      ...Object.fromEntries(
        Object.keys(CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT).map((key) => [key, 'none'] as const),
      ),
      ...existingSortState,
    };
  }
  public override itemsPerPageSignal = signal(CUSTOM_FILE_INTERFACE_VIEWER_ITEMS_PER_PAGE);

  /**
   * Checks whether a prepared value or list contains visible content.
   * @param value - Consumer-owned value used only for display.
   * @returns Whether the value should render instead of the empty-cell placeholder.
   */
  public hasDisplayValue(value: unknown): boolean {
    return Array.isArray(value)
      ? value.some((item) => this.hasDisplayValue(item))
      : value !== null && value !== undefined && (typeof value !== 'string' || value.trim() !== '');
  }

  /**
   * Supplies the shared placeholder without changing sortable values or action metadata.
   * @param value - Prepared cell value supplied by the consumer.
   * @returns A dash for missing or blank values, otherwise the original display text.
   */
  public getDisplayValue(value: unknown): string {
    return this.hasDisplayValue(value) ? String(value) : '-';
  }
}
