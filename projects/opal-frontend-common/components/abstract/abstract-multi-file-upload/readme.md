# Abstract multi-file upload

`AbstractMultiFileUploadComponent` extends `AbstractFormBaseComponent` to connect parent-owned file rows to a child form.
The parent owns file validation, requests, progress, responses, sequencing and cancellation. The child supplies its
`FormGroup`, required-field rule, error messages and MoJ template.

## Child form

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { MojMultiFileUploadComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload';
import { MojMultiFileUploadInputComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-input';
import { MojMultiFileUploadFilesComponent } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/moj-multi-file-upload-files';

@Component({
  selector: 'app-documents-upload-form',
  imports: [
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
    MojMultiFileUploadComponent,
    MojMultiFileUploadInputComponent,
    MojMultiFileUploadFilesComponent,
  ],
  templateUrl: './documents-upload-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsUploadFormComponent extends AbstractMultiFileUploadComponent {
  protected override fieldErrors = {
    files: {
      required: { message: 'Select a document', priority: 1 },
      fileUpload: { message: 'Remove documents with errors before continuing', priority: 2 },
      uploadPending: { message: 'Wait for all documents to finish uploading', priority: 3 },
    },
  };

  public override form = new FormGroup({
    files: new FormControl<readonly File[]>([], {
      nonNullable: true,
      validators: [Validators.required, this.fileUploadValidator],
    }),
  });

  protected override handleErrorMessages(): void {
    super.handleErrorMessages();
    const errors = this.fileErrors().join(' ');
    if (errors) {
      this.formErrorSummaryMessage = this.formErrorSummaryMessage.map((error) =>
        error.fieldId === 'files' ? { ...error, message: errors } : error,
      );
    }
  }
}
```

The inherited validator reports supplied row errors and files whose upload status has not reached confirmed success.
It does not inspect file content or choose validation rules. Omit `Validators.required` when files are optional.
The protected `uploadControlName` defaults to `files`; initialise an override before constructing the form and align
the form control, error map and native input ID.

```html
<opal-lib-govuk-error-summary [errors]="formErrorSummaryMessage" (errorClick)="scrollTo($event)" />
<form [formGroup]="form" method="post" enctype="multipart/form-data" (submit)="handleFormSubmit($event)">
  <opal-lib-moj-multi-file-upload>
    <opal-lib-moj-multi-file-upload-files
      [files]="fileUploads()"
      [disabled]="form.controls.files.disabled"
      (removeFile)="removeFile($event); uploadInput.focus()"
    />
    <opal-lib-moj-multi-file-upload-input
      #uploadInput
      [control]="form.controls.files"
      inputId="files"
      inputName="files"
      labelText="Upload documents"
      hintText="Choose up to 5 CSV documents, each no larger than 5 MB"
      [acceptedTypes]="['.csv']"
      [errors]="fileInputErrors"
      (filesSelected)="onFilesSelected($event)"
    />
  </opal-lib-moj-multi-file-upload>
  <p class="govuk-visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
  <button type="submit" class="govuk-button">Continue</button>
</form>
```

Continue stays enabled. An invalid submission runs the inherited validation, displays and focuses the error summary,
and does not emit `formSubmit`. A valid submission emits `formSubmit` to the parent.

The consuming child's `handleErrorMessages` override customises its upload summary entry; the shared upload base
retains standard form-summary handling. This frontend override joins the filename-specific `fileErrors()` with spaces
and updates only the existing `files` entry, preserving other errors and the inherited disabled-control handling.
Its text matches the messages passed inline through `fileInputErrors`. For example, one entry reads
`accounts.csv: The file must be 5 MB or smaller. notes.txt: Choose a CSV file.` and targets `files`, the native upload
control's ID. The standard `GovukErrorSummaryComponent` is used unchanged. If you rename the control, align
`uploadControlName`, the form control name, `inputId` and the consuming child's summary `fieldId` mapping. Required-field
and pending-upload errors still use the configured field-error messages.

The input's internal file value accessor preserves the public `[control]` integration. Disable that control to disable
selection, and bind the files display's `disabled` input to the same control. The wrapper remains plain projection;
the child template supplies the live region.

## Parent data flow

Bind parent state into the child and handle its user intents:

```html
<app-documents-upload-form
  [files]="fileUploads()"
  [announcement]="announcement()"
  (filesSelected)="selectFiles($event)"
  (fileRemoved)="removeFile($event)"
  (filesCleared)="clearFiles()"
  (formSubmit)="complete()"
/>
```

Pass a new row array when status, progress or errors change. The POC uses signal updates with immutable row mapping;
the child treats the supplied collection as readonly.

In the actual POC this selector is `app-fines-file-upload-poc-form`. The parent also handles inherited `formSubmit`
and `unsavedChanges` outputs through the normal `AbstractFormParentBaseComponent` flow. The generic child example
above uses different labels and hints; its file rules must match the consuming parent's validator.

The frontend reference is in [opal-frontend](https://github.com/hmcts/opal-frontend), under
`src/app/flows/fines/fines-file-upload-poc/`:

| File                                                                   | What the frontend supplies                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `fines-file-upload-poc.component.ts`                                   | Validation, row/response state, sequential upload queue, progress/error mapping and cancellation. |
| `fines-file-upload-poc.component.html`                                 | Parent-to-child inputs and selection/removal/clear/form outputs.                                  |
| `fines-file-upload-poc-form/fines-file-upload-poc-form.component.ts`   | The child `FormGroup`, required rule, field-error map and filename-specific summary formatting.   |
| `fines-file-upload-poc-form/fines-file-upload-poc-form.component.html` | MoJ composition, error summary, live region and Continue action.                                  |
| `interfaces/fines-file-upload-poc-item.interface.ts`                   | Local row extension with its API response.                                                        |

The current POC validates a 1 MB limit and rejects MOV files using `FileService.isFileWithinSizeLimit` and
`hasFileExtension`. Its parent validates each batch, appends pending/rejected rows, and submits only valid rows to an
RxJS `concatMap` queue. Progress uses `getFileUploadProgress`; upload errors use `getFileUploadErrorMessage`. It waits
for `HttpEventType.Response` before setting success and handles empty responses/failures per file without stopping
the queue. Removal and clear signals cancel active work and skip removed queued rows. Destruction cancels the queue.

Those limits, messages and sequencing are consumer policy, not defaults of this base. The POC currently returns
**mock HTTP events** from its parent `uploadFile` method; it does not call a live upload API.

## Complete real-HTTP parent example

Save the child above as `documents-upload-form.component.ts` and its template as
`documents-upload-form.component.html`. This separate parent starts valid files in parallel; the actual POC uses a
sequential queue. Both choices belong to the consuming application. This example permits up to five CSV files of
5 MB each and applies a filename rule. Rejected rows do not use a file-count slot; accepted rows, including failed
uploads, retain their slot until removed.

Save this request adapter as `upload-document.ts`:

```ts
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function uploadDocument(http: HttpClient, url: string, file: File): Observable<HttpEvent<unknown>> {
  const body = new FormData();
  body.append('file', file, file.name);
  return http.post<unknown>(url, body, { observe: 'events', reportProgress: true });
}
```

Save the parent as `documents-upload.component.ts`. Supply your real API URL through its required `uploadUrl` input
and handle `completed` to perform the next page action:

```ts
import { HttpClient, HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import type { IAbstractMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload/interfaces';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { Subscription } from 'rxjs';
import { DocumentsUploadFormComponent } from './documents-upload-form.component';
import { uploadDocument } from './upload-document';

interface IDocumentUpload extends IAbstractMultiFileUploadItem {
  readonly response?: unknown;
}

@Component({
  selector: 'app-documents-upload',
  imports: [DocumentsUploadFormComponent],
  template: `
    <app-documents-upload-form
      [files]="fileUploads()"
      [announcement]="announcement()"
      (filesSelected)="selectFiles($event)"
      (fileRemoved)="removeFile($event)"
      (filesCleared)="clearFiles()"
      (formSubmit)="complete()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsUploadComponent {
  private readonly http = inject(HttpClient);
  private readonly fileService = inject(FileService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly uploads = new Map<string, Subscription>();
  private readonly fallbackError = 'The document could not be uploaded. Try again.';
  private nextId = 0;

  @Input({ required: true }) public uploadUrl!: string;
  @Output() public readonly completed = new EventEmitter<readonly IDocumentUpload[]>();

  public readonly fileUploads = signal<readonly IDocumentUpload[]>([]);
  public readonly announcement = signal('');

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelUploads());
  }

  private validateFile(file: File, acceptedCount: number): readonly string[] {
    const errors: string[] = [];
    if (!this.fileService.hasFileExtension(file.name, '.csv')) errors.push('Choose a CSV file.');
    if (!this.fileService.isFileWithinSizeLimit(file, 5 * 1024 * 1024))
      errors.push('The file must be 5 MB or smaller.');
    if (acceptedCount >= 5) errors.push('Choose no more than 5 files.');
    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(file.name)) {
      errors.push('Use letters, numbers, dots, hyphens and underscores in filenames.');
    }
    return errors;
  }

  private updateFile(id: string, update: Partial<Omit<IDocumentUpload, 'id'>>): void {
    this.fileUploads.update((items) => items.map((item) => (item.id === id ? { ...item, ...update } : item)));
  }

  private failUpload(item: IDocumentUpload, error: unknown): void {
    const message = this.fileService.getFileUploadErrorMessage(error, this.fallbackError);
    this.updateFile(item.id, { status: 'failed', errors: [message] });
    this.announcement.set(`${item.name}: ${message}`);
  }

  private startUpload(item: IDocumentUpload): void {
    let responseReceived = false;
    const subscription = new Subscription();
    this.uploads.set(item.id, subscription);
    this.updateFile(item.id, { status: 'uploading' });
    subscription.add(
      uploadDocument(this.http, this.uploadUrl, item.file).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.updateFile(item.id, { progress: this.fileService.getFileUploadProgress(event.loaded, event.total) });
          } else if (event.type === HttpEventType.Response) {
            responseReceived = true;
            this.updateFile(item.id, { status: 'success', progress: 100, response: event.body });
            this.announcement.set(`${item.name} uploaded.`);
          }
        },
        error: (error: unknown) => {
          this.failUpload(item, error);
          this.uploads.delete(item.id);
        },
        complete: () => {
          if (!responseReceived) this.failUpload(item, null);
          this.uploads.delete(item.id);
        },
      }),
    );
  }

  private cancelUploads(): void {
    this.uploads.forEach((subscription) => subscription.unsubscribe());
    this.uploads.clear();
  }

  public selectFiles(files: readonly File[]): void {
    let acceptedCount = this.fileUploads().filter((item) => item.status !== 'rejected').length;
    const added = files.map<IDocumentUpload>((file) => {
      const errors = this.validateFile(file, acceptedCount);
      if (!errors.length) acceptedCount++;
      return {
        id: `document-${this.nextId++}`,
        name: file.name,
        file,
        progress: null,
        errors,
        status: errors.length ? 'rejected' : 'pending',
      };
    });
    this.fileUploads.update((items) => [...items, ...added]);
    this.announcement.set(`${added.length} documents added. Check their upload status and any errors.`);
    added.filter((item) => item.status === 'pending').forEach((item) => this.startUpload(item));
  }

  public removeFile(id: string): void {
    this.uploads.get(id)?.unsubscribe();
    this.uploads.delete(id);
    this.fileUploads.update((items) => items.filter((item) => item.id !== id));
    this.announcement.set('Document removed.');
  }

  public clearFiles(): void {
    this.cancelUploads();
    this.fileUploads.set([]);
    this.announcement.set('');
  }

  public complete(): void {
    const files = this.fileUploads();
    if (files.length && files.every((item) => item.status === 'success')) this.completed.emit(files);
  }
}
```

Provide Angular's `HttpClient` in the application and keep its authentication/interceptor configuration. In this
Angular version, `provideHttpClient()` uses the XHR backend; `withFetch()` does not support upload progress. The
request adapter's URL, multipart field name and response type must match your backend contract. Server-side
validation is still required; the browser's extension and filename checks only improve selection feedback.

The parent owns every subscription. Removal, clearing and destruction unsubscribe from outstanding HTTP requests;
a failed upload leaves other files running. No retries are automatic. A stream that completes without a final
response becomes a failed row with the fallback message.

All five statuses are parent supplied: `pending`, `uploading`, `success`, `rejected` and `failed`. Unknown progress is
`null`; 100% progress remains uploading until a successful response confirms completion. Rejected rows carry errors
and are not submitted to the API. The shared item adds its original `file: File`, required `progress: number | null`
and `errors: readonly string[]` to the display interface. It has no response field; the local subtype stores the
backend response.

## Base contract

| Member                 | Responsibility                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `files` input          | Required readonly `IAbstractMultiFileUploadItem[]` from the parent; updates `fileUploads()` and cumulative file-control values/validity. |
| `announcement` input   | Parent-supplied text for the child template's live region; defaults to an empty string.                                                  |
| `filesSelected` output | Latest raw user-selected `readonly File[]`; the parent validates and updates rows.                                                       |
| `fileRemoved` output   | Row ID requested for removal; the parent removes it and cancels its work.                                                                |
| `filesCleared` output  | Request to clear the journey; emitted by `handleClearForm()`.                                                                            |
| `fileErrors()`         | Filename-prefixed row errors available for inline messages and consumer-owned summary formatting.                                        |
| `fileInputErrors`      | Row messages from `fileErrors()`, falling back to the child form's current control error.                                                |
| `fileUploadValidator`  | Checks supplied row errors and pending/mismatched upload state.                                                                          |

`onFilesSelected` and `removeFile` emit intentions. `handleClearForm` resets the child form and emits `filesCleared`.
These methods do not start/cancel requests or mutate the parent's row collection. On a clear request, the parent
cancels active and queued work, clears rows and resets its announcement. Pass the resulting empty `files` back into
the child.

The base inherits common form outputs and standard error-summary handling. Filename-specific summary formatting
belongs to the consuming child, as shown above. Keep Continue enabled and let inherited `handleFormSubmit` validate
before emitting `formSubmit`; invalid submissions display the summary. Chain overridden lifecycle methods to `super`
to retain form listeners and cleanup.

## Testing

Run the colocated library unit tests for the form adapter, MoJ components and FileService from the repository root:

```bash
corepack yarn test \
  --include='**/abstract-multi-file-upload/**/*.spec.ts' \
  --include='**/moj-multi-file-upload/**/*.spec.ts' \
  --include='**/services/file-service/**/*.spec.ts'

corepack yarn test:coverage \
  --include='**/abstract-multi-file-upload/**/*.spec.ts' \
  --include='**/moj-multi-file-upload/**/*.spec.ts' \
  --include='**/services/file-service/**/*.spec.ts' \
  --coverage-include='projects/opal-frontend-common/components/abstract/abstract-multi-file-upload/**/*.ts' \
  --coverage-include='projects/opal-frontend-common/components/moj/moj-multi-file-upload/**/*.ts' \
  --coverage-include='projects/opal-frontend-common/services/file-service/**/*.ts'
```

The focused suite currently covers all statements, functions and lines. The only uncovered branch is Angular's
generated abstract-component factory fallback; the tests exercise concrete child components rather than instantiate
an abstract class or call private Angular metadata. The MoJ components, FileService and download utilities have full
branch coverage. This library suite does not run the frontend parent's request flow; that consuming page supplies its
own mocked-HTTP unit tests. The live-HTTP example above demonstrates integration and is not a backend test fixture.
