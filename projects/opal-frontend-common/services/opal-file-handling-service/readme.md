# Opal File Handling Service

`OpalFileHandlingService` provides the three read APIs for interface-file metadata and original file content.
It is an HTTP wrapper: the consuming application builds search criteria, maps display values and decides when to save a file.

## Table of Contents

- [Installation](#installation)
- [Methods and paths](#methods-and-paths)
- [Query parameters](#query-parameters)
- [Response interfaces](#response-interfaces)
- [Usage](#usage)
- [Application integration](#application-integration)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

The service is provided in root. Use the application's existing `HttpClient` setup; no component provider is required.

```ts
import {
  OpalFileHandlingService,
  getPathWithFileId,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
  IOpalFileHandlingInterfaceFilesRefData,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import {
  OPAL_FILE_HANDLING_BASE_PATH,
  OPAL_FILE_HANDLING_PATHS,
  OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM,
  OPAL_FILE_HANDLING_INTERFACE_FILE_CONTENT_ACCEPT,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/constants';
```

## Methods and paths

The shared base URI is `/opal-file-handling-service/`. The frontend's existing proxy forwards this prefix to the File Handling Service.

| Method                              | HTTP request                                                   | Return type                                          |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `getInterfaceFilesRefData(params?)` | `GET /opal-file-handling-service/interface-files`              | `Observable<IOpalFileHandlingInterfaceFilesRefData>` |
| `getInterfaceFile(fileId)`          | `GET /opal-file-handling-service/interface-files/{id}`         | `Observable<IOpalFileHandlingInterfaceFile>`         |
| `getInterfaceFileContent(fileId)`   | `GET /opal-file-handling-service/interface-files/{id}/content` | `Observable<HttpResponse<Blob>>`                     |

Each method returns a cold Observable: a request starts on subscription. All three GET requests have no request body.
Use the numeric metadata field `interface_file_id` for `fileId`. The `{id}` placeholder is replaced with the URL-encoded identifier.
`getPathWithFileId(path, fileId)` is exported for callers that also need the resolved URL, such as a visible download link.

The content method sends `Accept: application/octet-stream`, uses `responseType: 'blob'` and observes the full response.
It returns the bytes and response headers without saving, parsing or converting the file. The stored content determines the file format.

## Query parameters

`IOpalFileHandlingInterfaceFileParams` contains these optional filters:

| Parameter            | Type, excluding optional `null` | Purpose                                                                |
| -------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `source`             | `string`                        | One interface source code, for example `ALLPAY`.                       |
| `target`             | `string`                        | One target code, for example `OPAL`.                                   |
| `not_target`         | `string`                        | One target code to exclude.                                            |
| `type`               | `string[]`                      | Included file-type codes: `SOURCE`, `SOURCE_JSON`, `TRANSFORMED_JSON`. |
| `domain`             | `string`                        | One domain code, for example `FINES`.                                  |
| `status`             | `string`                        | One status code to include.                                            |
| `not_status`         | `string[]`                      | Status codes to exclude.                                               |
| `business_unit_code` | `string`                        | A business-unit code, retaining leading zeros, for example `0046`.     |
| `from_date`          | `string`                        | Inclusive creation-date lower boundary.                                |
| `to_date`            | `string`                        | Inclusive creation-date upper boundary.                                |

Array filters are serialized as one comma-separated query value, matching the backend's `explode: false` contract.
`target` and `not_target` remain scalar values. `null`, `undefined`, empty strings and empty arrays are omitted; empty array entries are removed before joining.

```ts
const params: IOpalFileHandlingInterfaceFileParams = {
  domain: 'FINES',
  target: 'OPAL',
  type: ['SOURCE', 'TRANSFORMED_JSON'],
  not_status: ['FAILED_SUPERSEDED'],
  business_unit_code: '0046',
  from_date: '2026-10-13T23:00:00',
  to_date: '2026-10-20T22:59:59.999999',
};

fileHandlingService.getInterfaceFilesRefData(params).subscribe((response) => {
  const files = response.interface_files ?? [];
  // Pass files to the application's payload mapper.
});
```

The decoded query contains `type=SOURCE,TRANSFORMED_JSON` and `not_status=FAILED_SUPERSEDED`.
The service applies no default filters and performs no date calculations or timezone conversion.
Finance uses `DateService` to take each selected calendar date's local start or end of day, converts it to UTC and
formats the boundary as `yyyy-MM-dd'T'HH:mm:ss` without an offset suffix. It appends `.999999` to `to_date` to include
the final database microsecond. The example above covers 14–20 October 2026 in Europe/London: local midnight on
14 October is `2026-10-13T23:00:00` UTC, and the end of 20 October is `2026-10-20T22:59:59.999999` UTC.
These calculations belong to the frontend query/date helpers; this API wrapper sends the supplied strings unchanged.

## Response interfaces

`getInterfaceFilesRefData()` returns `number_of_results: number` and `interface_files: IOpalFileHandlingInterfaceFile[] | null`.
`getInterfaceFile()` returns one metadata object with the same item shape.

| Metadata field                                 | Shared interface type | Meaning                                                       |
| ---------------------------------------------- | --------------------- | ------------------------------------------------------------- |
| `interface_file_id`                            | `number \| null`      | Identifier used by the metadata and content endpoints.        |
| `file_name`                                    | `string \| null`      | Original filename; useful as the download fallback.           |
| `created_datetime`                             | `string \| null`      | Unmodified API creation timestamp.                            |
| `source`, `target`, `type`, `domain`, `status` | `string \| null`      | Raw API codes.                                                |
| `business_unit_codes`                          | `string[] \| null`    | Business-unit codes, not IDs or display names.                |
| `filestore_uuid`, `checksum`                   | `string \| null`      | Storage identifier and checksum metadata.                     |
| `errors`                                       | `string \| null`      | JSON encoded as a string, not an already parsed error object. |

The shared interfaces accept nullable item fields defensively. The backend schema requires the ID, filename, timestamp, source, target, type, domain and status;
storage/checksum/business-unit/error values can be absent or null. The service returns the response unchanged.

This illustrative response is documentation data only:

```json
{
  "number_of_results": 1,
  "interface_files": [
    {
      "interface_file_id": 1001,
      "file_name": "interface-file.xml",
      "created_datetime": "2026-10-20T12:00:00",
      "source": "ALLPAY",
      "target": "OPAL",
      "type": "SOURCE",
      "domain": "FINES",
      "status": "SUCCESS",
      "business_unit_codes": ["0046"],
      "filestore_uuid": null,
      "checksum": null,
      "errors": null
    }
  ]
}
```

## Usage

### Retrieve one metadata record

```ts
fileHandlingService.getInterfaceFile(1001).subscribe((file) => {
  // Use file.interface_file_id for a subsequent content request.
});
```

### Download with FileService

[FileService](../file-service/readme.md) saves the returned response through a dedicated caller-owned anchor.
The example uses `downloadFile(response$, options)` so the original event is prevented synchronously and request/save errors share one subscription.

```ts
import { ChangeDetectionStrategy, Component, DestroyRef, Input, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import {
  OpalFileHandlingService,
  getPathWithFileId,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { OPAL_FILE_HANDLING_PATHS } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/constants';

@Component({
  selector: 'app-interface-file-download-example',
  template: `
    @if (file.interface_file_id !== null) {
      <a
        class="govuk-link"
        [href]="contentUrl(file.interface_file_id)"
        [attr.aria-label]="'Download ' + (file.file_name || 'interface file ' + file.interface_file_id)"
        (click)="download($event, saveLink)"
        >Download</a
      >
    }
    <a #saveLink hidden>Download file</a>
    @if (downloadError()) {
      <p role="alert">{{ downloadError() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceFileDownloadExampleComponent {
  private readonly fileHandling = inject(OpalFileHandlingService);
  private readonly fileService = inject(FileService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) public file!: IOpalFileHandlingInterfaceFile;
  public readonly downloadError = signal('');

  /** Returns the content endpoint for the visible link. */
  public contentUrl(fileId: number): string {
    return getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId);
  }

  /** Requests and saves the selected file, retaining the caller's anchor. */
  public download(event: Event, link: HTMLAnchorElement): void {
    const fileId = this.file.interface_file_id;
    if (fileId === null) {
      event.preventDefault();
      return;
    }
    this.downloadError.set('');
    this.fileService
      .downloadFile(this.fileHandling.getInterfaceFileContent(fileId), {
        link,
        event,
        fallbackFilename: this.file.file_name || 'interface-file-' + fileId,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => this.downloadError.set('The file could not be downloaded. Try again.') });
  }
}
```

The hidden anchor has no click handler; the component owns its lifetime. FileService restores its original `href`/`download` attributes and revokes the temporary object URL.
With a supplied response Observable, HTTP settings remain those of `getInterfaceFileContent()`.

If a caller already has an `HttpResponse<Blob>`, it can call `fileService.saveResponse(response, { link, fallbackFilename })` directly.
Prevent the original event before awaiting an asynchronous request when using this lower-level method.

A response `Content-Disposition` filename is preferred over `fallbackFilename`; an explicit FileService `filename` option overrides both.
The current backend does not set a download filename header, so the metadata filename is the normal fallback.
The response is `application/octet-stream`; retaining its original bytes and filename preserves XML, XLSX or another stored format without conversion.

## Application integration

The application's existing `HttpClient`, interceptors and File Handling proxy supply transport and authentication behaviour.
This service adds no retries, permission checks, feature-flag checks, automatic page-load requests or browser downloads.
The Finance routes apply their existing authentication, View Interface Files permission and Banking Interfaces feature controls.
The current backend content endpoint checks file existence and requires status `SUCCESS`; the viewer also offers a Download
link for the display status `File failed`, so that action can receive a status-validation error.
In the current `opal-file-handler-service` implementation, list and content permission checks are deferred to PO-8686;
the metadata-by-ID endpoint retains its access check. Frontend route checks do not replace backend authorization.
Review this integration note when the backend permission work is completed.

`FinesFinanceInterfaceFilesPayloadService` under `fines-finance/services` supplies permitted business-unit filter choices and code-to-name labels. Each file page owns its direction-specific constants and pure query/row-mapping helpers; outbound also owns business-unit response selection. These helpers reuse shared date-filter, business-unit and row-mapping utilities under `fines-finance/services/utils`.
The inbound and outbound components are separate Finance routes. Both extend `FinesFinanceInterfaceFilesBaseDirective`
under `fines-finance/directives`, which shares search cancellation, result state, downloads and error focus. Each page
template supplies the [interface-file viewer](../../components/custom/custom-file-interface-viewer/readme.md) with mapped
rows, filter choices and a download action template, and owns its error summary and hidden save anchor.
Use the existing application setup; these services do not require new proxy or application configuration.

## Testing

Service tests cover the three GET requests, scalar/CSV query serialization, empty-filter omission and unchanged binary responses.
From the common-library repository:

```bash
yarn test --include='**/services/opal-file-handling-service/opal-file-handling.service.spec.ts'
```

## Contributing

Keep this wrapper aligned with the File Handling API contract. Update its interfaces, request tests and this README together when that contract changes.
