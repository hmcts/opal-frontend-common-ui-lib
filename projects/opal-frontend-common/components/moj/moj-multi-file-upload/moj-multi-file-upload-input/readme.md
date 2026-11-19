# MoJ multi-file upload input

Connects a parent-owned file `FormControl` to the labelled native picker and drag and drop area using reactive forms.
The required `control` input accepts an `AbstractControl` containing `readonly File[]` or `null`, following the library's
GOV.UK text-input pattern. Use `inputId`, `inputName` and `labelText` to configure the control; `labelClasses` defaults to
`govuk-label--m` and `inputClasses` defaults to an empty string.

`hintText` is an optional `string | null` and defaults to `null`. A null or empty hint renders no hint element and
does not add a hint ID to the native input's `aria-describedby`. Dropzone instructions and errors remain associated
with the input independently.

With the default `updateOn: 'change'`, a selection within the count limit updates the control with the latest raw file
batch and marks it dirty. The accessor notifies Angular on blur and after an accepted drop; `updateOn: 'blur'` commits pending
changes at that point.
With `updateOn: 'submit'`, Angular defers value/dirty/touched changes until submission. For an accepted batch,
`filesSelected` emits the latest raw user intent immediately and independently. The parent validates files and decides
when to start uploads.
Accepted batches follow the control's update setting for validation and `valueChanges`, including clearing an earlier
count error.
`acceptedTypes` sets the native `accept` hint and does not validate files.

## Maximum files per selection

The input permits ten files per picker/drop event by default. Configure a stable property on the consuming child form.
for example, Variant Banking permits six:

```ts
// Inside the consuming form component:
public readonly maxFiles = 6;
public readonly acceptedTypes: readonly string[] = ['.dat'];
```

```html
<opal-lib-moj-multi-file-upload-input
  inputId="files"
  inputName="files"
  labelText="Upload Variant Banking files"
  hintText="Choose up to 6 DAT files at the same time, each no larger than 2 MiB."
  [control]="form.controls.files"
  [maxFiles]="maxFiles"
  [acceptedTypes]="acceptedTypes"
  [errors]="fileInputErrors"
  (filesSelected)="onFilesSelected($event)"
/>
```

`maxFiles` accepts a positive integer and defaults to `10`. The `MOJ_MULTI_FILE_UPLOAD_DEFAULT_MAX_FILES` constant is
available from the upload `/constants` entrypoint. An omitted, non-positive, non-integer or non-finite limit falls back
to ten.

If a selection exceeds the limit, **none of that batch is emitted or uploaded**. The input retains the previous control
value and adds `{ maxFiles: { maxFiles: N, actualFiles: count } }` through its Angular validator. It displays
`You can only select up to N files at the same time.` as an inline GOV.UK error associated with the input; use
`maxFilesErrorMessage` to replace that text. A new valid selection or an empty reset clears the error. No prefix of an
oversized batch is accepted, and no native file-count attribute is used.

Binding a different control clears the previous selection rejection. A rejected batch does not commit an earlier
pending blur-based selection.

The limit is per event, not cumulative. Programmatically supplied cumulative files are not limited. Type, size and
filename validation remain parent responsibilities, including for dropped files. Configure a matching
`fieldErrors.files.maxFiles` message with higher priority than required/row errors for the page summary; the
[child-form example](../../../abstract/abstract-multi-file-upload/readme.md#child-form) shows the mapping.

Call `control.disable()`/`enable()` to control selection. Resetting clears the native picker without emitting a new
selection. Programmatically supplied files remain in the model; browsers do not allow repopulating the native picker.
For cumulative selection, the parent supplies its row list to the abstract child form, which synchronises the control.

The picker label retains the standard MoJ button appearance and keyboard focus indicator. `focus()` targets the native
file input; the `getControl` getter exposes the supplied typed file control.

See the [composition guide](../readme.md) for inputs, events and composed usage.

The input requires `control`, `inputId`, `inputName` and `labelText`. It has no upload handler, file-size rules or
independent disabled input. In the frontend POC, the form child passes its `files` control and forwards `filesSelected`
to the parent; the parent supplies validation and cumulative rows through the
[abstract form base](../../../abstract/abstract-multi-file-upload/readme.md).

The consuming frontend form renders the page's error summary and formats its filename-specific messages. Keep
Continue enabled. With the abstract form base, an invalid submission displays and focuses the summary; a valid
submission emits `formSubmit`.
The [complete frontend example](../../../abstract/abstract-multi-file-upload/readme.md#child-form) shows this wiring.
