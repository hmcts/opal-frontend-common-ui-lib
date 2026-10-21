import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './common/custom-file-interface-viewer-inbound-table-wrapper/custom-file-interface-viewer-inbound-table-wrapper.component';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT } from './common/custom-file-interface-viewer-inbound-table-wrapper/constants/custom-file-interface-viewer-inbound-table-wrapper-sort-default.constant';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import {
  canDownloadInterfaceFileRow,
  getDownloadableInterfaceFile,
  getInterfaceFileDownloadHref,
  getInterfaceFileDownloadOptions,
} from './utils/custom-inbound-file-viewer-download.utils';

@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [
    CustomFileInterfaceViewerFiltersComponent,
    CustomFileInterfaceViewerInboundTableWrapperComponent,
    CustomPageHeaderComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent {
  private readonly document = inject(DOCUMENT);
  private readonly fileService = inject(FileService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  @ViewChild('fileDownloadLink', { static: true, read: ElementRef })
  private readonly fileDownloadLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('downloadErrorSummary', { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public tableData: ICustomFileInterfaceViewerInboundTableWrapperTableData[] | null = null;
  @Input() public refreshFailed: boolean = false;

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public readonly inboundTableSort = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;
  public readonly downloadErrors = signal<IAbstractFormBaseFormErrorSummaryMessage[]>([]);
  public readonly canDownload = canDownloadInterfaceFileRow;
  public readonly getDownloadHref = getInterfaceFileDownloadHref;

  /**
   * Shows a download error and focuses its summary after the view updates.
   *
   * @param fileId - The file whose download link the error should reference.
   */
  private showDownloadError(fileId: number): void {
    this.downloadErrors.set([
      { fieldId: `interface-file-download-${fileId}`, message: 'The file could not be downloaded. Try again.' },
    ]);
    afterNextRender(
      () => this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus(),
      { injector: this.injector },
    );
  }

  /**
   * Returns focus to the failed download link, falling back to the results container.
   *
   * @param fieldId - The download-link ID selected from the error summary.
   */
  public onDownloadErrorClick(fieldId: string): void {
    const target =
      this.document.getElementById(fieldId) ?? this.document.getElementById('inbound-interface-files-results');
    target?.focus();
  }

  /**
   * Requests a currently downloadable file and displays failures within the viewer.
   *
   * @param fileId - The interface file selected for download.
   * @param event - The original link click whose default navigation is prevented.
   */
  public onDownloadFile(fileId: number, event: Event): void {
    const file = getDownloadableInterfaceFile(this.tableData, fileId);
    if (!file) {
      event.preventDefault();
      return;
    }

    this.downloadErrors.set([]);
    this.fileService
      .downloadFile(
        getInterfaceFileDownloadHref(fileId),
        getInterfaceFileDownloadOptions(file, this.fileDownloadLink.nativeElement, event),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => this.showDownloadError(fileId) });
  }
}
