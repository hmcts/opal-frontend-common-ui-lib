import { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';

export interface ICustomFileInterfaceViewerInboundTableWrapperTableData extends ICustomFileInterfaceViewerTableData {
  Type: string | null;
  Source: string | null;
}
