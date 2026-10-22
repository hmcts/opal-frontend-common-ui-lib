import { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';

export interface ICustomFileInterfaceViewerOutboundTableWrapperTableData extends ICustomFileInterfaceViewerTableData {
  Target: string | null;
}
