import type { MojMultiFileUploadStatus } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/types';

/** Display state supplied and owned by the consuming application. */
export interface IMojMultiFileUploadItem {
  readonly id: string;
  readonly name: string;
  readonly status: MojMultiFileUploadStatus;
  /** Actual upload percentage; omit or use null when the transport total is unknown. */
  readonly progress?: number | null;
  readonly errors?: readonly string[];
}
