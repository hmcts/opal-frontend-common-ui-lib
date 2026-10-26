import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomFileInterfaceViewerBase } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/directives/custom-file-interface-viewer-base';
import { CustomFileInterfaceViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import type { ICustomFileInterfaceViewerOutboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer/interfaces';

/**
 * Configures the shared presentational viewer for outbound filters and the Target column.
 * Inherits the row, action-template and submission contract from the common viewer base.
 */
@Component({
  selector: 'opal-lib-custom-outbound-file-viewer',
  imports: [CustomFileInterfaceViewerComponent],
  templateUrl: './custom-outbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomOutboundFileViewerComponent extends CustomFileInterfaceViewerBase<ICustomFileInterfaceViewerOutboundTableWrapperTableData> {
  public override readonly isInbound = false;
}
