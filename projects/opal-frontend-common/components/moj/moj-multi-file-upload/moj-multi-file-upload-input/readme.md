# MoJ multi-file upload input

Connects a parent-owned file `FormControl` to the labelled native picker and drag and drop area using reactive forms.
The required `control` input accepts an `AbstractControl` containing `readonly File[]` or `null`, following the library's
GOV.UK text-input pattern. Use `inputId`, `inputName` and `labelText` to configure the control; `labelClasses` defaults to
`govuk-label--m` and `inputClasses` defaults to an empty string.

With the default `updateOn: 'change'`, user selection updates the control with the latest raw file batch and marks it
dirty. The accessor notifies Angular on blur and after a drop; `updateOn: 'blur'` commits pending changes at that point.
With `updateOn: 'submit'`, Angular defers value/dirty/touched changes until submission. `filesSelected` emits the latest
raw user intent immediately and independently. The parent validates files and decides when to start uploads.
`acceptedTypes` sets the native `accept` hint and does not validate files.

Call `control.disable()`/`enable()` to control selection. Resetting clears the native picker without emitting a new
selection. Programmatically supplied files remain in the model; browsers do not allow repopulating the native picker.
For cumulative selection, the parent supplies its row list to the abstract child form, which synchronises the control.

The picker label retains the standard MoJ button appearance and keyboard focus indicator. `focus()` targets the native
file input; the `getControl` getter exposes the supplied typed file control.

See the [composition guide](../readme.md) for inputs, events and composed usage.

The input requires `control`, `inputId`, `inputName` and `labelText`. It has no upload handler, size/count limits or
independent disabled input. In the frontend POC, the form child passes its `files` control and forwards `filesSelected`
to the parent; the parent supplies validation and cumulative rows through the
[abstract form base](../../../abstract/abstract-multi-file-upload/readme.md).

The consuming frontend form renders the page's error summary and formats its filename-specific messages. Keep
Continue enabled. With the abstract form base, an invalid submission displays and focuses the summary; a valid
submission emits `formSubmit`.
The [complete frontend example](../../../abstract/abstract-multi-file-upload/readme.md#child-form) shows this wiring.
