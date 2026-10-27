import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';

/** Form and display data supplied by the parent; API responses stay in the consuming application. */
export interface IAbstractMultiFileUploadItem extends IMojMultiFileUploadItem {
  readonly file: File;
  readonly progress: number | null;
  readonly errors: readonly string[];
}
