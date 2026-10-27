# MoJ multi-file upload files

A presentation component for a parent-owned list of selected files. It displays filenames, statuses, actual progress
and supplied errors. The parent validates files, performs uploads, updates the list and supplies announcement text.
The consuming template renders the live region beside the plain `MojMultiFileUploadComponent` wrapper.

```ts
import { MojMultiFileUploadFilesComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files';
import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import { MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files/constants';
```

```html
<opal-lib-moj-multi-file-upload-files
  [files]="files()"
  heading="Documents added"
  (removeFile)="removeDocument($event)"
/>
```

| Input              | Default                 | Purpose                                                                                  |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------------------- |
| `files`            | `[]`                    | Readonly display records owned by the parent. Empty lists hide the feedback area.        |
| `heading`          | `'Files added'`         | Heading above the file rows.                                                             |
| `statusLabels`     | Built-in English labels | Partial overrides for `pending`, `uploading`, `success`, `rejected` and `failed`.        |
| `removeButtonText` | `'Remove'`              | Visible text for the per-file action; the filename is included for assistive technology. |
| `showRemoveButton` | `true`                  | Whether to display per-file removal actions.                                             |
| `disabled`         | `false`                 | Whether removal buttons are disabled.                                                    |

`removeFile` emits the record's string `id` as a removal intent. The component never changes the supplied list or
cancels an upload. The parent handles the action, updates its state and manages focus after removing a row.

The `/interfaces` entrypoint also exports `IMojMultiFileUploadStatusLabels`; `/types` exports `MojMultiFileUploadStatus`.
The default `MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS` object is exported from the files component's `/constants`
entrypoint, as shown above. The component entrypoint exports only `MojMultiFileUploadFilesComponent`. See the
[composition guide](../readme.md) for the other public import paths.

The explicit `status` controls success/error styling and icons. Uploading at 100% remains uploading until the parent
supplies `status: 'success'` after the upload response. Unknown progress (`null` or omitted) has no percentage or
`aria-valuenow`. Errors are displayed exactly as supplied by the parent; no validation or fallback errors are generated.
The feedback uses the standard MoJ single-message file rows, native status icons and removal-button classes.
Include the library's global GOV.UK/MoJ styles in the application; this component adds no local styles.

The component does not require a form control. In the frontend form composition, bind `disabled` to the upload
control's disabled state and forward removal to the parent. See the
[abstract upload guide](../../../abstract/abstract-multi-file-upload/readme.md) for the complete data flow.

The consuming frontend form owns the page's error summary and Continue action. Keep Continue enabled and display
and focus the summary when the submitted form is invalid. The frontend example combines filename-specific errors into one
summary entry for the upload control; each file row retains its own messages.
