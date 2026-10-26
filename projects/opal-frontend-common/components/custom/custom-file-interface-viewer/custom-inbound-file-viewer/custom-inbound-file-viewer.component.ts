import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomFileInterfaceViewerBase } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/directives/custom-file-interface-viewer-base';
import { CustomFileInterfaceViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer/constants';
import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer/interfaces';

/**
 * Configures the shared presentational viewer for inbound source/type filters and columns.
 * Inherits the row, action-template and submission contract from the common viewer base.
 */
@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [CustomFileInterfaceViewerComponent],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent extends CustomFileInterfaceViewerBase<ICustomFileInterfaceViewerInboundTableWrapperTableData> {
  @Input({ required: true }) public override source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public override sourceList: IAlphagovAccessibleAutocompleteItem[] = [];

  public override readonly isInbound = true;
  public readonly inboundTableSort = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;
  public override readonly tableSort = this.inboundTableSort;
}
