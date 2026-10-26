import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './common/custom-file-interface-viewer-inbound-table-wrapper/custom-file-interface-viewer-inbound-table-wrapper.component';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT } from './common/custom-file-interface-viewer-inbound-table-wrapper/constants/custom-file-interface-viewer-inbound-table-wrapper-sort-default.constant';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import { ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext } from './common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-action-template-context.interface';

@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [
    CustomFileInterfaceViewerFiltersComponent,
    CustomFileInterfaceViewerInboundTableWrapperComponent,
    CustomPageHeaderComponent,
  ],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent {
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public tableData: ICustomFileInterfaceViewerInboundTableWrapperTableData[] | null = null;
  @Input()
  public actionTemplate: TemplateRef<ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext> | null = null;

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public readonly inboundTableSort = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;
}
