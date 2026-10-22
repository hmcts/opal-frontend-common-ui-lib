import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT } from '../../custom-file-interface-viewer-table-wrapper/constants/custom-file-interface-viewer-table-sort-default.constant';
import { ICustomFileInterfaceViewerActionTemplateContext } from '../../custom-file-interface-viewer-table-wrapper/interfaces/custom-file-interface-viewer-action-template-context.interface';
import { ICustomFileInterfaceViewerTableData } from '../../interfaces/custom-file-interface-viewer-table-data.interface';

/**
 * Shares prepared rows, caller-owned actions and valid filter submissions between viewer wrappers.
 * The row generic preserves each direction's action context without adding request or download behavior.
 */
@Directive()
export abstract class CustomFileInterfaceViewerBase<TFile extends ICustomFileInterfaceViewerTableData> {
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  public source: IAlphagovAccessibleAutocompleteItem[] = [];
  public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public tableData: TFile[] | null = null;
  @Input() public actionTemplate: TemplateRef<ICustomFileInterfaceViewerActionTemplateContext<TFile>> | null = null;

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public abstract readonly isInbound: boolean;
  public readonly tableSort = CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT;
}
