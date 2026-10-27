# MoJ multi-file upload

Three presentation components compose the [MoJ multi-file upload pattern](https://design-patterns.service.justice.gov.uk/components/multi-file-upload/).
The parent owns validation rules, the upload API, progress, responses, sequencing and cancellation. A child form can
extend [AbstractMultiFileUploadComponent](../../abstract/abstract-multi-file-upload/readme.md) to receive those rows,
emit selection/removal intents and synchronise reactive-form values and validity.

For the complete parent/child wiring and the real frontend POC source paths, use the
[abstract upload guide](../../abstract/abstract-multi-file-upload/readme.md#parent-data-flow). The POC's request is
currently mocked by its parent; the library performs no upload API call.

## Import and compose

```ts
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { MojMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload';
import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import { MojMultiFileUploadInputComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-input';
import { MojMultiFileUploadFilesComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files';
```

Add `ReactiveFormsModule`, `GovukErrorSummaryComponent` and the three MoJ components to the standalone child form's
`imports`. Extend
`AbstractMultiFileUploadComponent` and configure its file control as in the frontend POC:

```ts
public override form = new FormGroup({
  files: new FormControl<readonly File[]>([], {
    nonNullable: true,
    validators: [Validators.required, this.fileUploadValidator],
  }),
});
```

Supply the field-error mapping from the [complete child-form example](../../abstract/abstract-multi-file-upload/readme.md#child-form).

Include the library's global styles once:

```scss
@use '@hmcts/opal-frontend-common/styles';
```

Display interfaces have their own `/interfaces` entrypoint. The status type has a `/types` entrypoint. Default labels
have a dedicated `/moj-multi-file-upload-files/constants` entrypoint. Component entrypoints export their components:

```ts
import type { IMojMultiFileUploadStatusLabels } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import type { MojMultiFileUploadStatus } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/types';
import { MOJ_MULTI_FILE_UPLOAD_STATUS_LABELS } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files/constants';
```

The wrapper projects its contents. The input updates the supplied file control and emits the latest raw user selection.
The files component renders supplied rows and emits remove intentions. The wrapper and files display component do not
require form controls. The consuming template supplies the persistent live region beside the wrapper.

```html
<opal-lib-govuk-error-summary [errors]="formErrorSummaryMessage" (errorClick)="scrollTo($event)" />
<form [formGroup]="form" method="post" enctype="multipart/form-data" (submit)="handleFormSubmit($event)">
  <opal-lib-moj-multi-file-upload>
    <opal-lib-moj-multi-file-upload-files
      heading="Documents added"
      [files]="fileUploads()"
      [disabled]="form.controls.files.disabled"
      (removeFile)="removeFile($event); uploadInput.focus()"
    />
    <opal-lib-moj-multi-file-upload-input
      #uploadInput
      inputId="files"
      inputName="files"
      labelText="Upload documents"
      hintText="Files must be no larger than 1MB. MOV files are not accepted."
      [control]="form.controls.files"
      [errors]="fileInputErrors"
      (filesSelected)="onFilesSelected($event)"
    />
  </opal-lib-moj-multi-file-upload>
  <p class="govuk-visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
  <button type="submit" class="govuk-button">Continue</button>
</form>
```

Projection lets the page choose the order and add its own content. The feedback heading and rows are hidden while
the supplied list is empty; the empty feedback container remains in the DOM with MoJ's `moj-hidden` class. A remove intent
contains the row's `id`; the parent decides whether to remove it, cancel its request and restore focus with the input's
public `focus()` method. The base forwards that intent to the parent and includes supplied upload state in form validity.
Continue stays enabled: inherited `handleFormSubmit` displays and focuses the summary on an invalid submission and
emits `formSubmit` only when valid. The example's 1 MB/MOV guidance is frontend policy; other consumers supply their own
hints and rules.

The markup follows MoJ's base form structure and enhanced appearance. The wrapper applies
`moj-multi-file-upload--enhanced` and the `data-module="moj-multi-file-upload"` marker. The input includes the medium
label and base **Upload file** submit button; standard MoJ styles hide that button in enhanced mode while Angular
renders the drop zone and Choose files label. The components use the shared MoJ styles without custom upload SCSS.

Angular renders the enhanced controls directly. The library does not initialise MoJ's vendor `MultiFileUpload`
JavaScript, which replaces the native input and performs its own XHR uploads. Uploading remains owned by the consuming
page.

## Component API

### Wrapper: `opal-lib-moj-multi-file-upload`

Projects consumer content with the standard MoJ upload wrapper classes. It has no inputs, outputs or upload state.

### Input: `opal-lib-moj-multi-file-upload-input`

| Input              | Default                         | Purpose                                                                                                  |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `control`          | Required                        | Parent-owned `AbstractControl` containing `readonly File[]` or `null`; supplied as a file `FormControl`. |
| `inputId`          | Required                        | Unique native input ID and target for page error-summary links.                                          |
| `inputName`        | Required                        | Native file input name.                                                                                  |
| `labelText`        | Required                        | Accessible upload-control label.                                                                         |
| `labelClasses`     | `'govuk-label--m'`              | Classes added to the label.                                                                              |
| `inputClasses`     | `''`                            | Classes added to the native file input.                                                                  |
| `hintText`         | `''`                            | Guidance associated with the control; describe the page's type, size and count rules here.               |
| `dropzoneHintText` | `'Drag and drop files here or'` | Drag-and-drop instruction.                                                                               |
| `buttonText`       | `'Choose files'`                | Text of the native picker label, displayed as a button.                                                  |
| `uploadButtonText` | `'Upload file'`                 | Text of the base submit button, hidden by standard MoJ styles in enhanced mode.                          |
| `multiple`         | `true`                          | Native picker selection mode. The parent also enforces any single-file rule for dropped selections.      |
| `acceptedTypes`    | `[]`                            | Native `accept` hint, for example `['.csv', 'application/pdf']`. **This does not validate files.**       |
| `errors`           | `[]`                            | Parent-supplied messages displayed and associated with the upload control.                               |

`filesSelected` emits the latest raw `readonly File[]` from the picker or drop zone. The component supplies no file
validation rules or uploads; the page must validate every selected file, including dropped files. `focus()` moves focus
to the native file input; the picker label shows the MoJ keyboard focus indicator. The `getControl` getter exposes the
supplied typed file control, following the same control-binding pattern as the library's GOV.UK text input.

### Reactive forms behaviour

The required `control` input accepts the parent control through an `AbstractControl` setter. The native input uses
Angular reactive forms with an internal file value accessor; consumers do not import or configure that accessor.

With the default `updateOn: 'change'`, picker selections and drops set the control's value to the **latest selection
batch** as `readonly File[]` and mark it dirty. The accessor notifies Angular on blur and after a drop. Angular applies
value/dirty updates on blur for `updateOn: 'blur'`, and defers value/dirty/touched updates until submission for
`updateOn: 'submit'`. `filesSelected` still emits the raw user intent immediately; the parent controls when API work starts.
Validators attached by the consuming page run against that value. `acceptedTypes` remains a picker hint, so the page
must still supply its own file validation.

Use `form.controls.files.disable()` and `.enable()` to control the picker, drop zone and upload action. There is no
separate disabled input. Resetting the control clears the native picker without emitting `filesSelected`. Setting
`File[]` programmatically updates the model without attempting to repopulate the browser's native file selection.

The file control can be disabled independently of the rest of the form. Bind the files display's `disabled` input to
that same control, as shown above, so its remove actions follow the selection control's state.

For an accumulating journey, the parent keeps the cumulative row list and passes it to the child through `[files]`.
The [abstract upload base](../../abstract/abstract-multi-file-upload/readme.md) synchronises that list's original files
into the child control and revalidates supplied row errors/statuses. The child does not need manual `setValue` calls.
Keep Continue enabled and validate on submission, as in the template. These parent-supplied rows are explicit model
updates, separate from the native accessor's `updateOn` timing.

When using that base, `handleClearForm()` emits `filesCleared`. The parent handles cancellation, clears its rows and
passes the empty collection back into the child. Resetting only the file control clears its value and native picker;
it does not cancel parent requests or clear parent state.

### Files: `opal-lib-moj-multi-file-upload-files`

| Input              | Default                 | Purpose                                                                                                             |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `files`            | `[]`                    | Readonly display rows owned by the parent.                                                                          |
| `heading`          | `'Files added'`         | Feedback heading.                                                                                                   |
| `statusLabels`     | Built-in English labels | Partial `IMojMultiFileUploadStatusLabels` overrides for `pending`, `uploading`, `success`, `rejected` and `failed`. |
| `removeButtonText` | `'Remove'`              | Text of each remove action.                                                                                         |
| `showRemoveButton` | `true`                  | Whether remove actions are displayed.                                                                               |
| `disabled`         | `false`                 | Disables remove actions.                                                                                            |

`removeFile` emits the row's string `id`. It does not mutate the supplied rows or cancel requests.

```ts
interface IMojMultiFileUploadItem {
  readonly id: string;
  readonly name: string;
  readonly status: MojMultiFileUploadStatus;
  readonly progress?: number | null;
  readonly errors?: readonly string[];
}
```

Supply a real percentage for uploading rows, or omit `progress`/set it to `null` when the transport total is unknown.
The component displays 100% as uploading until the parent supplies `status: 'success'`. Success uses a tick and green
styling. Rejection and failure use warning icons, explanatory messages and red styling. Keep original `File` objects,
responses and other journey data in your parent model; they are not part of the display interface.

## File Service helpers

Inject `FileService` into the consuming component for generic upload progress, size, extension and error handling.
These methods do not start upload requests, own row state or choose validation rules. The parent still chooses file
types, size/count limits, filename rules, fallback messages and page actions.

Inject this service in the parent that validates files and performs uploads. The abstract child form does not own
those application operations.

```ts
import { inject } from '@angular/core';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
```

Add the service field to your consuming component:

```ts
private readonly fileService = inject(FileService);
```

Use its instance methods in the page's existing validation and upload callbacks:

```ts
const progress = this.fileService.getFileUploadProgress(event.loaded, event.total);
const withinLimit = this.fileService.isFileWithinSizeLimit(file, maximumBytes);
const permittedExtension = this.fileService.hasFileExtension(file.name, permittedFileExtension);
const errorMessage = this.fileService.getFileUploadErrorMessage(error, fallbackMessage);
```

`getFileUploadProgress` converts actual uploaded/total byte counts to a rounded percentage between 0 and 100, returning
`null` when progress cannot be measured. A result of 100 does not imply upload success; set the row's status to
`success` only after the upload response confirms completion.

`isFileWithinSizeLimit` checks the supplied byte limit, including files exactly at that limit. `hasFileExtension`
checks the filename extension case-insensitively, accepting an extension with or without its leading dot. It does not
inspect contents or validate a filename convention. Apply these checks before starting an upload and supply rejected
rows and explanatory messages when necessary. Add count and custom filename checks in the consuming page.

`getFileUploadErrorMessage` uses an HTTP problem description or title, a plain `Error.message`, or the caller's
fallback when no usable message is available. The parent places the result in its file row and form errors.

Manage row updates in the parent and pass them to the child through the abstract base's `files` input, or directly to
the MoJ display components. See [File Service](../../../services/file-service/readme.md) for method contracts and
HTTP-provider requirements.

## Accessibility and error summaries

Choose a unique, stable `inputId` and a meaningful `labelText`. The input associates its label, hints and supplied errors with
the native file input. Selection works with a keyboard as well as drag and drop. File rows convey status through text
and icons as well as colour.

Keep one error-summary entry for the upload control and combine its filename-specific validation/upload messages,
using the same text as the inline upload-control errors. The link targets the upload control's `inputId`. For example:

```html
<ul class="govuk-list govuk-error-summary__list">
  <li><a href="#files">accounts.csv: The file must be 5 MB or smaller. notes.txt: Choose a CSV file.</a></li>
</ul>
```

The consuming child customises `formErrorSummaryMessage` in its own `handleErrorMessages` override, using the base's
`fileErrors()` to combine the filename-specific messages. See the
[complete child-form example](../../abstract/abstract-multi-file-upload/readme.md#child-form). The shared upload base
retains standard validation/summary handling and supplies individual inline messages through `fileInputErrors`.
The standard `GovukErrorSummaryComponent` remains unchanged. Keep the native `inputId` aligned with the configured
form control name. Without the abstract base, the consuming page supplies its own validation and submission handling.

Pass those messages to the input's `errors` and update the consuming template's persistent live region for meaningful
status changes. The abstract base accepts an `announcement` text input for that region. The consuming template also
controls focus after removing rows or responding to errors.

## Verification

Colocated unit tests cover wrapper projection and consumer interactions, picker/drop selection events, input accessibility
and supplied errors, file statuses and progress display, mixed display states and remove intentions. File Service
unit tests cover its upload metadata methods.

```sh
corepack yarn test --include='**/moj-multi-file-upload/**/*.spec.ts'
corepack yarn exports:check
corepack yarn build
```
