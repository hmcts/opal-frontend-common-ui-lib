import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import {
  CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT,
  CustomFileInterfaceViewerInboundTableWrapperComponent,
  ICustomFileInterfaceViewerInboundTableWrapperTableData,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-inbound-table-wrapper';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { IOpalFileHandlingInterfaceFilesRefData } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [
    CustomFileInterfaceViewerFiltersComponent,
    CustomFileInterfaceViewerInboundTableWrapperComponent,
    CustomPageHeaderComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public domain: string = '';
  @Input({ transform: booleanAttribute }) public isInbound: boolean = false;
  @Input() public interfaceFilesRefData: IOpalFileHandlingInterfaceFilesRefData | null = null;
  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public readonly inboundTableSort = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;

  public get inboundTableData(): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
    return (
      this.interfaceFilesRefData?.interface_files?.map((file) => ({
        'File ID': file.file_id,
        'Date and time': file.date_and_time,
        Title: file.file_name,
        Type: file.type,
        'Business unit': file.business_unit_code,
        Source: file.source,
        Status: file.status,
        Actions: null,
      })) ?? []
    );
  }

  public ngOnInit(): void {
    console.log(
      'CustomInboundFileViewerComponent initialized with direction:',
      this.isInbound ? 'inbound' : 'outbound',
    );
  }

  public ngOnDestroy(): void {
    console.log('CustomInboundFileViewerComponent destroyed');
  }
}
