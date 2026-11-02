import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';

export interface ICustomFileInterfaceViewerActionTemplateContext<
  TFile extends ICustomFileInterfaceViewerTableData = ICustomFileInterfaceViewerTableData,
> {
  $implicit: TFile;
}
