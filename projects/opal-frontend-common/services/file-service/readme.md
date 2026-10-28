# File Service

`FileService` creates Blobs, starts browser downloads from existing content, complete HTTP responses or backend URLs, and provides metadata helpers for caller-owned uploads. It is a standalone service with its own public entry point and is provided in Angular's root injector.

The caller supplies the backend URL or response Observable, the native save anchor and, optionally, the original click event. The service has no knowledge of interface files, report APIs, permissions or page error messages.

For the reusable file screen, see [Custom File Interface Viewer](../../components/custom/custom-file-interface-viewer/readme.md). For interface-file API contracts and calls, see [Opal File Handling Service](../opal-file-handling-service/readme.md).

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
- [Upload metadata helpers](#upload-metadata-helpers)
- [Options](#options)
- [Usage](#usage)
- [Saving existing content](#saving-existing-content)
- [Using an existing API request](#using-an-existing-api-request)
- [Filename and MIME selection](#filename-and-mime-selection)
- [Response formats and file formats](#response-formats-and-file-formats)
- [Subscriptions, errors and cleanup](#subscriptions-errors-and-cleanup)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the service from its entrypoint. Option interfaces and types are available from that same entrypoint or their
dedicated entrypoints; constants are available from their dedicated entrypoint:

```typescript
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import type {
  IFileDownloadOptions,
  IFileSaveOptions,
} from '@hmcts/opal-frontend-common/services/file-service/interfaces';
import type {
  FileDownloadSourceType,
  FileDownloadResponseType,
  FileDownloadHeadersType,
  FileDownloadParamsType,
} from '@hmcts/opal-frontend-common/services/file-service/types';
import {
  FILE_CONTENT_UNAVAILABLE_ERROR,
  FILE_DOWNLOAD_DEFAULT_FILENAME,
} from '@hmcts/opal-frontend-common/services/file-service/constants';
```

The service entrypoint continues to export `IFileDownloadOptions`, `IFileSaveOptions`, `FileDownloadSourceType`,
`FileDownloadResponseType`, `FileDownloadHeadersType` and `FileDownloadParamsType` alongside `FileService`, so existing
imports remain supported. Import only the contracts needed by the caller; the optional constants expose the service's
default `download` filename and `File content is unavailable.` error message.

The application must provide Angular's `HttpClient`. Keep the application's existing HTTP provider and interceptors when it already has them. A minimal application configuration is:

```typescript
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
```

Inject `FileService` with `inject(FileService)` or constructor injection. An additional `FileService` provider is unnecessary because it uses `providedIn: 'root'`. Its `HttpClient` dependency is resolved on injection, including when the caller only uses the methods for existing content.

## Methods

| Method                                                                        | Returns            | Behaviour                                                                                                                                  |
| ----------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `createBlob(content: BlobPart, mimeType?: string)`                            | `Blob`             | Wraps content in a Blob without starting a download. Retains an existing Blob when its MIME label is unchanged.                            |
| `saveFile(content: BlobPart, options: IFileSaveOptions)`                      | `void`             | Immediately saves existing content through the supplied anchor.                                                                            |
| `saveResponse(response: HttpResponse<BlobPart>, options: IFileSaveOptions)`   | `void`             | Immediately saves a complete response, using its headers and body to resolve download defaults.                                            |
| `downloadFile(source: FileDownloadSourceType, options: IFileDownloadOptions)` | `Observable<void>` | Uses a URL to make a GET request, or subscribes to a caller-supplied response Observable. Saves each response received after subscription. |

`BlobPart` accepts a Blob, a string, an ArrayBuffer or an ArrayBuffer view such as a typed array. Callers must serialize structured data into a file representation before passing it to the service.

## Upload metadata helpers

The service also provides generic checks and error formatting for a caller-owned upload journey:

| Method                                                               | Returns          | Behaviour                                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `getFileUploadProgress(loaded: number, total?: number \| null)`      | `number \| null` | Rounded percentage between 0 and 100, or `null` when progress cannot be measured.                                               |
| `isFileWithinSizeLimit(file: Pick<File, 'size'>, maxBytes: number)`  | `boolean`        | Checks a finite, non-negative file size against the caller's inclusive byte limit.                                              |
| `hasFileExtension(filename: string, extension: string)`              | `boolean`        | Case-insensitive suffix check; accepts an extension with or without its leading dot.                                            |
| `getFileUploadErrorMessage(error: unknown, fallbackMessage: string)` | `string`         | Uses non-blank HTTP problem `detail`, `description`, `message`, then `title`, or a plain `Error.message`; otherwise returns the caller's fallback. |

```typescript
const progress = this.fileService.getFileUploadProgress(event.loaded, event.total);
const withinLimit = this.fileService.isFileWithinSizeLimit(file, maximumBytes);
const permittedExtension = this.fileService.hasFileExtension(file.name, permittedFileExtension);
const errorMessage = this.fileService.getFileUploadErrorMessage(error, fallbackMessage);
```

Supply actual transport byte counts and choose size limits, extensions and user-facing fallback messages in the
consuming application. A percentage of 100 confirms only the byte transfer; the caller still waits for its upload
response before marking the file successful. Extension checking does not inspect contents or enforce a filename
convention. Network failures and HTTP bodies without usable problem messages use the supplied fallback rather than
Angular's transport diagnostic message.

These methods belong to the injected `FileService`; call them through its instance. They do not send upload requests
or own queues, row state, validation messages or form controls. Keep row updates and journey-specific rules in the
consuming component. The [MoJ multi-file upload components](../../components/moj/moj-multi-file-upload/readme.md) display
the parent-supplied selection and upload state.

The frontend POC uses all four in `src/app/flows/fines/fines-file-upload-poc/fines-file-upload-poc.component.ts`:
size/extension checks run before queueing files, byte progress maps HTTP progress events, and error formatting supplies
each failed row's message. Its child form and the shared abstract base do not perform API calls. See the
[abstract upload guide](../../components/abstract/abstract-multi-file-upload/readme.md#parent-data-flow) for that wiring
and the production HTTP request adapter.

## Options

`IFileSaveOptions` applies to both immediate save methods and is inherited by `IFileDownloadOptions`.

| Option             | Type                | Required | Default and behaviour                                                                                                                                            |
| ------------------ | ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `link`             | `HTMLAnchorElement` | Yes      | Caller-owned native save anchor, with no application click handler. The service temporarily changes its `href` and `download` attributes and then restores them. |
| `event`            | `Event`             | No       | The original user event. Its default action is prevented synchronously when the method is called.                                                                |
| `filename`         | `string`            | No       | A non-empty value overrides the filename from response headers and `fallbackFilename`.                                                                           |
| `fallbackFilename` | `string`            | No       | Used when there is no explicit or usable response filename. Defaults to `download`.                                                                              |
| `mimeType`         | `string`            | No       | Explicit MIME label for the content. Does not convert its file format. An explicitly empty string clears the label.                                              |

`IFileDownloadOptions` adds the following settings. These HTTP settings apply when `source` is a URL string. For a response Observable, configure the request in the API service that creates it.

| Option            | Type                                                                                                    | Default and behaviour                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `responseType`    | `'blob' \| 'text' \| 'arraybuffer'`                                                                     | Defaults to `blob`. Controls how `HttpClient` reads the response body.                                |
| `headers`         | `HttpHeaders \| Record<string, string \| string[]>`                                                     | No additional headers supplied by FileService. Use the backend contract's `Accept` value when needed. |
| `params`          | `HttpParams \| Record<string, string \| number \| boolean \| readonly (string \| number \| boolean)[]>` | No additional query parameters. Angular serializes the supplied values.                               |
| `context`         | `HttpContext`                                                                                           | No context supplied by FileService; Angular's normal defaults apply.                                  |
| `withCredentials` | `boolean`                                                                                               | No override; Angular's default applies.                                                               |

A URL source always uses GET with `observe: 'response'` and no request body. To use POST, another HTTP method or existing API logic, pass a full-response Observable instead.

## Usage

Keep the visible action link separate from the native save anchor. The visible link handles the user's action; the helper anchor has no click handler and is clicked by the service. Reusing the visible link as the save anchor would invoke its handler again.

The following standalone component receives its real backend URL from its parent. The supplied URL remains the visible link's destination, while the original click event and dedicated save anchor are passed to FileService.

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';

@Component({
  selector: 'app-file-download',
  template: `
    <a class="govuk-link" [href]="downloadUrl()" (click)="download($event)">Download file</a>
    <a #saveLink hidden>Download file</a>
    @if (errorMessage()) {
      <p role="alert">{{ errorMessage() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDownloadComponent {
  private readonly fileService = inject(FileService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('saveLink', { static: true, read: ElementRef })
  private readonly saveLink!: ElementRef<HTMLAnchorElement>;

  public readonly downloadUrl = input.required<string>();
  public readonly fallbackFilename = input('download');
  public readonly errorMessage = signal<string | null>(null);

  /** Starts a download and leaves page-specific error handling with the component. */
  public download(event: Event): void {
    this.errorMessage.set(null);
    this.fileService
      .downloadFile(this.downloadUrl(), {
        link: this.saveLink.nativeElement,
        event,
        responseType: 'blob',
        fallbackFilename: this.fallbackFilename(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => this.errorMessage.set('The file could not be downloaded. Please try again.'),
      });
  }
}
```

Call this method after the view and its anchor exist, such as from the displayed link's click handler. In applications with SSR, perform the browser save in response to a browser interaction; the service does not provide a server-side download fallback.

The example's error message belongs to the component. Integrations should use their existing page error and focus conventions. FileService does not suppress application HTTP interceptors or choose an error presentation for the caller.

## Saving existing content

Use `saveFile` when the content already exists in the browser. These helpers can be added to the component above and called by its UI, passing the original click event.

```typescript
/** Saves CSV text that has already been serialized by the caller. */
public saveCsv(csv: string, event: Event): void {
  this.fileService.saveFile(csv, {
    link: this.saveLink.nativeElement,
    event,
    filename: 'report.csv',
    mimeType: 'text/csv;charset=utf-8',
  });
}

/** Saves existing PDF content without converting or regenerating it. */
public savePdf(pdf: Blob | ArrayBuffer, event: Event): void {
  this.fileService.saveFile(pdf, {
    link: this.saveLink.nativeElement,
    event,
    filename: 'report.pdf',
    mimeType: 'application/pdf',
  });
}
```

For CSV, callers are responsible for escaping fields and choosing the desired row separators. For PDF, pass bytes that already represent a valid PDF document.

Use `createBlob` when a Blob is needed without a download:

```typescript
const csvBlob = this.fileService.createBlob('Reference,Amount\r\nMOCK-001,12.34\r\n', 'text/csv');
```

Use `saveResponse(response, options)` when a complete `HttpResponse<BlobPart>` is already available synchronously. It resolves the response filename and MIME defaults described below, then uses the same native save behaviour.

## Using an existing API request

Pass a response Observable when an API service already owns the URL, HTTP method, body, authentication or endpoint-specific headers. The source must emit complete `HttpResponse` objects, as opposed to body-only values or upload/download progress events.

For example, this adapter keeps the caller's POST URL and body while delegating the browser save to FileService:

```typescript
import { HttpClient } from '@angular/common/http';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import type { IFileSaveOptions } from '@hmcts/opal-frontend-common/services/file-service/interfaces';
import { Observable } from 'rxjs';

/** Creates a POST file request; the caller subscribes and owns cancellation and errors. */
export function downloadPostResponse(
  http: HttpClient,
  fileService: FileService,
  url: string,
  body: unknown,
  options: IFileSaveOptions,
): Observable<void> {
  const response$ = http.post(url, body, {
    observe: 'response',
    responseType: 'blob',
  });

  return fileService.downloadFile(response$, options);
}
```

The caller still supplies `options.link` and can supply `options.event` and a fallback filename. Subscribe to the returned Observable and attach the component's usual destruction and error handling, as in the GET example. No POST request occurs until it is subscribed to.

## Filename and MIME selection

For `saveFile`, the filename is the first non-empty value in this order:

1. `options.filename`.
2. `options.fallbackFilename`.
3. `download`.

For `saveResponse` and `downloadFile`, it is:

1. Non-empty `options.filename`.
2. The decoded UTF-8 `filename*` from `Content-Disposition`.
3. A plain quoted or unquoted `filename` from `Content-Disposition`.
4. Non-empty `options.fallbackFilename`.
5. `download`.

A malformed encoded filename falls back to the plain header filename or the configured fallback. The service does not infer or append a file extension. Supply a filename from trusted application metadata when the backend does not provide one. Cross-origin backends must expose `Content-Disposition` through CORS for browser code to read it.

For response-based saves, MIME selection follows this order:

1. `options.mimeType`, including an explicitly empty string.
2. The existing Blob's non-empty `type`.
3. The response `Content-Type` header.
4. No MIME label.

For `createBlob` and direct `saveFile`, an omitted MIME type preserves an existing Blob's label; non-Blob content is wrapped without a label. An explicit different MIME label creates a new Blob containing the same content. Matching Blob MIME labels are compared case-insensitively and retain the existing Blob instance.

## Response formats and file formats

`responseType`, MIME type and filename have separate purposes:

| Setting             | Example                                                   | Purpose                                       |
| ------------------- | --------------------------------------------------------- | --------------------------------------------- |
| HTTP `responseType` | `blob`, `arraybuffer`, `text`                             | How Angular reads the response body.          |
| MIME label          | `application/pdf`, `text/csv`, `application/octet-stream` | Describes the content for the browser.        |
| Filename            | `report.pdf`, `report.csv`                                | Suggests the saved file's name and extension. |

Use `blob` or `arraybuffer` for original binary file content. Use `text` for a response intended to be decoded as text. FileService wraps strings using the browser's Blob encoding; binary content is not converted to JSON or decoded as text by the service.

Changing a MIME label or filename does not generate a different file format. For example, setting `application/pdf` on CSV text does not produce a PDF, and setting an XLSX extension does not create a workbook. Generate or retrieve the correct format before saving it. The service preserves Blob and binary input content, including the selected byte range of a typed-array view.

## Subscriptions, errors and cleanup

- `saveFile` and `saveResponse` run immediately. `createBlob` only creates or returns a Blob.
- `downloadFile` prevents a supplied event's default action immediately, even before subscription. Requesting and saving begin on subscription. A URL source uses Angular's cold HTTP Observable; a caller-supplied Observable retains its own cold or hot behaviour.
- Each emitted complete response starts a download and emits `undefined`. For a normal HTTP request this happens once. Completion means the response was processed and the native save was started; it does not confirm that the user finished saving the file.
- Unsubscribing detaches from the supplied source. With a normal Angular HTTP request, this cancels an outstanding request. It cannot undo a native download that has already started.
- HTTP failures and save failures are forwarded to the `downloadFile` subscriber. `saveFile` and `saveResponse` can throw synchronously. The service does not retry requests or display error messages.
- A `null` response body causes `Error('File content is unavailable.')`. An empty string or zero-byte Blob remains a valid file.
- HTTP requests use the application's configured interceptor chain. FileService forwards caller-provided request options for URL sources and does not set interceptor-specific context values.
- Saving creates a temporary object URL, assigns it to the supplied anchor and calls its native `click()`. The anchor's original `href` and `download` attributes are restored in a `finally` block, and the caller retains ownership of the anchor.
- The object URL is revoked in a zero-delay timer after the click, including when the click throws. The service does not remove the caller's anchor or create another anchor.

## Testing

The service and its helpers have colocated unit tests:

- [file.service.spec.ts](./file.service.spec.ts): public methods, upload progress/validation/error helpers, native downloads, HTTP formats and options, cancellation, errors and original binary content.
- [file-blob.utils.spec.ts](./utils/file-blob.utils.spec.ts): Blob identity, MIME labels, strings and binary views.
- [file-download-filename.utils.spec.ts](./utils/file-download-filename.utils.spec.ts): filename header parsing and fallbacks.
- [file-response-options.utils.spec.ts](./utils/file-response-options.utils.spec.ts): response filename and MIME precedence.
- [file-save-link.utils.spec.ts](./utils/file-save-link.utils.spec.ts): caller-owned anchor restoration and object-URL cleanup.

From the library repository root, run the colocated source unit tests:

```bash
corepack yarn test --include='**/services/file-service/**/*.spec.ts'
corepack yarn test:coverage --include='**/services/file-service/**/*.spec.ts' --coverage-include='projects/opal-frontend-common/services/file-service/**/*.ts'
```

## Contributing

Keep file operations generic. Endpoint-specific requests, permissions, row eligibility and page error presentation belong to the consumer. Reuse existing library helpers where their behaviour matches, preserve original binary content and update the public option contracts, examples and colocated specs together.
