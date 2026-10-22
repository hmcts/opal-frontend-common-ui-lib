import { ICustomFileInterfaceViewerTableData } from '../../interfaces/custom-file-interface-viewer-table-data.interface';

export interface ICustomFileInterfaceViewerActionTemplateContext<
  TFile extends ICustomFileInterfaceViewerTableData = ICustomFileInterfaceViewerTableData,
> {
  $implicit: TFile;
}
