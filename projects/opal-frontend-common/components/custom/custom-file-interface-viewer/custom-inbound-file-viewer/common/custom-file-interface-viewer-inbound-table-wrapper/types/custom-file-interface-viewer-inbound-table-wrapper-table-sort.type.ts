import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '../interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';

export type ICustomFileInterfaceViewerInboundTableWrapperTableSort = IAbstractSortState & {
  [K in keyof Omit<
    ICustomFileInterfaceViewerInboundTableWrapperTableData,
    'File ID' | 'dateTimeDisplay'
  >]: SortDirectionType;
};
