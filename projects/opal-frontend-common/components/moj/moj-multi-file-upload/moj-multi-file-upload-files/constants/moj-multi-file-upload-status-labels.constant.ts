import type { IMojMultiFileUploadStatusLabels } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';

export const MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS: Readonly<IMojMultiFileUploadStatusLabels> = {
  pending: 'Waiting to upload',
  uploading: 'Uploading',
  success: 'Uploaded',
  rejected: 'File rejected',
  failed: 'Upload failed',
};
