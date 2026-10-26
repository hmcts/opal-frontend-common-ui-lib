import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer/interfaces';

export type ICustomFileInterfaceViewerInboundTableWrapperTableSort = IAbstractSortState & {
  [
    K in keyof Omit<ICustomFileInterfaceViewerInboundTableWrapperTableData, 'File ID' | 'dateTimeDisplay'>
  ]: SortDirectionType;
};
