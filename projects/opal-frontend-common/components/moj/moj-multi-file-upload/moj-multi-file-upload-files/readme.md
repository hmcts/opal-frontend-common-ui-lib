# MoJ multi-file upload files

A presentation component for a parent-owned list of selected files. The parent validates files, performs uploads,
updates row state and supplies announcement text to a live region beside the upload wrapper.

```ts
import { MojMultiFileUploadFilesComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files';
import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
```

```html
<opal-lib-moj-multi-file-upload-files [files]="files()" heading="Documents added" />
```

| Input          | Default                 | Purpose                                                                     |
| -------------- | ----------------------- | --------------------------------------------------------------------------- |
| `files`        | `[]`                    | Readonly display records. An empty list renders no feedback content.        |
| `heading`      | `'Files added'`         | Heading shown above nonempty file rows.                                     |
| `statusLabels` | Built-in English labels | Partial overrides for accessible statuses and failed/rejected descriptions. |

The component has no outputs or per-file actions. It does not change records or perform requests.
With an empty list, it renders no heading, rows, wording or separator. The consuming frontend supplies its own
empty-state content and separators outside this component.

Each filename uses regular black GOV.UK body text. A successful row has a separate green tick to the left of its
filename and no visible success suffix. A failed or rejected row has a separate red warning icon to the left of its
filename. Each SVG has an accessible label for its status. Parent-supplied errors appear in red above the filename.
A failed/rejected row without detailed errors displays its status label there instead.
Pending status text is available to assistive technology without adding a visible filename suffix.

Uploading rows show a percentage to the right of the filename, with a named `progressbar`, minimum/maximum/current
values and accessible status text. Unknown progress (`null` or omitted) displays the uploading label and omits
`aria-valuenow`. Uploading at 100% remains uploading until the parent confirms `status: 'success'`.

Include the library's global GOV.UK/MoJ styles. File rows use the standard summary-list layout, status icon and
GOV.UK typography classes; the component has no custom stylesheet.

The `/interfaces` entrypoint exports `IMojMultiFileUploadStatusLabels`; `/types` exports `MojMultiFileUploadStatus`.
Default labels are exported as `MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS` from the files component's `/constants`
entrypoint. The component entrypoint exports only `MojMultiFileUploadFilesComponent`. See the
[composition guide](../readme.md) for other public import paths.

The component needs no form control. The consuming form owns the page's error summary and submission action. Keep
that action enabled and focus the summary when submitted data is invalid. See the
[abstract upload guide](../../../abstract/abstract-multi-file-upload/readme.md) for the complete parent/child flow.
