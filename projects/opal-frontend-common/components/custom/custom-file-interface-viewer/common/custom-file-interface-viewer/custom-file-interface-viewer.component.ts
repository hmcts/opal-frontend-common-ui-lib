import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomFileInterfaceViewerTableWrapperComponent } from '../custom-file-interface-viewer-table-wrapper/custom-file-interface-viewer-table-wrapper.component';
import { CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT } from '../custom-file-interface-viewer-table-wrapper/constants/custom-file-interface-viewer-table-sort-default.constant';
import { ICustomFileInterfaceViewerTableData } from '../interfaces/custom-file-interface-viewer-table-data.interface';
import { ICustomFileInterfaceViewerActionTemplateContext } from '../custom-file-interface-viewer-table-wrapper/interfaces/custom-file-interface-viewer-action-template-context.interface';

/**
 * Composes direction-specific headings, shared filters and prepared result rows.
 * Forwards valid submissions and consumer-owned actions without issuing API requests.
 */
@Component({
  selector: 'opal-lib-custom-file-interface-viewer',
  imports: [
    CustomFileInterfaceViewerFiltersComponent,
    CustomFileInterfaceViewerTableWrapperComponent,
    CustomPageHeaderComponent,
  ],
  templateUrl: './custom-file-interface-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerComponent {
  @Input() public isInbound: boolean = false;
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public tableData: ICustomFileInterfaceViewerTableData[] | null = null;
  @Input() public tableSort: IAbstractSortState = CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT;
  @Input() public actionTemplate: TemplateRef<ICustomFileInterfaceViewerActionTemplateContext> | null = null;

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();
}
