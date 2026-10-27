import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type {
  IMojMultiFileUploadItem,
  IMojMultiFileUploadStatusLabels,
} from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import { MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files/constants';

@Component({
  selector: 'opal-lib-moj-multi-file-upload-files',
  templateUrl: './moj-multi-file-upload-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojMultiFileUploadFilesComponent {
  @Input() files: readonly IMojMultiFileUploadItem[] = [];
  @Input() heading = 'Files added';
  @Input() statusLabels: Partial<IMojMultiFileUploadStatusLabels> = {};
  @Input() removeButtonText = 'Remove';
  @Input() showRemoveButton = true;
  @Input() disabled = false;
  @Output() removeFile = new EventEmitter<string>();

  /** Formats the supplied status and known upload percentage without changing state. */
  public statusText(item: IMojMultiFileUploadItem): string {
    const label = this.statusLabels[item.status] ?? MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS[item.status];
    return item.status === 'uploading' && item.progress !== undefined && item.progress !== null
      ? `${label} ${item.progress}%`
      : label;
  }
}
