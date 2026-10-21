# Custom Inbound File Viewer Component

This standalone Angular component renders the Inbound interface files heading, common filters, visible section
separator, sortable results table, empty state and file download actions. It accepts display-ready data from a frontend
wrapper and delegates saving to `FileService`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Table Data](#table-data)
- [Frontend Wrapper Example](#frontend-wrapper-example)
- [Methods and Download Behaviour](#methods-and-download-behaviour)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import {
  CustomInboundFileViewerComponent,
  ICustomFileInterfaceViewerInboundTableWrapperTableData,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
```

Add `CustomInboundFileViewerComponent` to the consuming standalone component's `imports` array. The application must
already provide `HttpClient`, its normal interceptors and the common library styles.

## Usage

```html
<opal-lib-custom-inbound-file-viewer
  [businessUnits]="businessUnits"
  [source]="source"
  [sourceList]="sourceList"
  [tableData]="tableData()"
  [refreshFailed]="refreshFailed()"
  (formSubmit)="onFormSubmit($event)"
></opal-lib-custom-inbound-file-viewer>
```

The [viewer overview](../readme.md) explains frontend routes, reference data, permissions, request scope and mappings.
The common [filters](../common/custom-file-interface-viewer-filters/readme.md) and
[table](../common/custom-file-interface-viewer-inbound-table-wrapper/readme.md) have separate API documentation.

## Inputs

| Input           | Type                                                               | Required | Default | Description                                                                           |
| --------------- | ------------------------------------------------------------------ | -------- | ------- | ------------------------------------------------------------------------------------- |
| `businessUnits` | `IAlphagovAccessibleAutocompleteItem[]`                            | Yes      | `[]`    | Permitted filter choices: business-unit names as `name`, string API codes as `value`. |
| `source`        | `IAlphagovAccessibleAutocompleteItem[]`                            | Yes      | `[]`    | Source choices, for example `{ name: 'Allpay', value: 'ALLPAY' }`.                    |
| `sourceList`    | `IAlphagovAccessibleAutocompleteItem[]`                            | Yes      | `[]`    | File-type choices, for example RAW/SOURCE and TRANSFORMED/TRANSFORMED_JSON.           |
| `tableData`     | `ICustomFileInterfaceViewerInboundTableWrapperTableData[] \| null` | No       | `null`  | Prepared rows. `null` leaves results unset; `[]` shows the completed empty state.     |
| `refreshFailed` | `boolean` | No | `false` | Enables Refresh after a failed list request, including when the filters are pristine. |

A required input must still be bound when its value is an empty array. The component has no `domain`, `isInbound`,
raw API-response, custom download-URL or MIME-type input. Its internal filter always uses inbound mode; its built-in
download action targets the File Handling Service. Use the standalone FileService directly when a different download
endpoint or response format is needed.

## Outputs

| Output       | Type                                           | Description                                                                                                   |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `formSubmit` | `EventEmitter<IAbstractFormBaseForm<unknown>>` | Forwards a valid filter submission. `formData` contains the raw UI filter values and `nestedFlow` is `false`. |

The frontend handles this event, builds API parameters, requests data and maps the response. The viewer does not
filter the input rows itself or issue list API calls. Sorting and pagination operate on the rows already supplied.

No initial `formSubmit` event is emitted. The frontend must start the initial request when the page is entered.
See the [filter form contract](../common/custom-file-interface-viewer-filters/readme.md) for fields and defaults.

## Table Data

Import the row interface from the inbound viewer entrypoint shown above. Each row contains:

| Property          | Type             | Description                                                                                                         |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `'File ID'`       | `number \| null` | Backend identifier used in download URLs and row tracking. Use unique IDs; a null ID suppresses the download link.  |
| `'Date and time'` | `number \| null` | Epoch milliseconds for chronological sorting.                                                                       |
| `dateTimeDisplay` | `string \| null` | Already formatted local date/time text shown in the cell.                                                           |
| `Title`           | `string \| null` | Original filename and download fallback filename.                                                                   |
| `Type`            | `string \| null` | Display label such as RAW or TRANSFORMED.                                                                           |
| `'Business unit'` | `string \| null` | Resolved business-unit name or joined names.                                                                        |
| `Source`          | `string \| null` | Source display label.                                                                                               |
| `Status`          | `string \| null` | Display label used for the status cell and download eligibility.                                                    |
| `Actions`         | `string \| null` | Row-contract field. The action cell is rendered from an action template, not this value; Finance sets it to `null`. |

For example:

```typescript
const row: ICustomFileInterfaceViewerInboundTableWrapperTableData = {
  'File ID': 1001,
  'Date and time': 1792497600000,
  dateTimeDisplay: '20 Oct 2026 at 13:00',
  Title: 'allpay_1001.xml',
  Type: 'RAW',
  'Business unit': 'Camberwell Green',
  Source: 'Allpay',
  Status: 'Ready',
  Actions: null,
};
```

The display timestamp above represents UTC `2026-10-20T12:00:00Z` in Europe/London. The frontend derives display text
using the user's local zone; it must not hard-code this example's offset.

The viewer supplies the table's descending date/time sort state. Rows are paginated in groups of 25. Supplying a new
row array reapplies sorting and resets the current page; an individual download leaves the array and current page intact.

## Frontend Wrapper Example

The following is the existing Finance wrapper pattern. It belongs in `opal-frontend`, under
`src/app/flows/fines/fines-finance/fines-finance-inbound-files`. The relative payload-service, interface and constant imports
are frontend-owned files, not exports from the common library.

The route supplies `snapshot.data.businessUnits` using `fetchBusinessUnitsResolver`. The payload service derives permitted
filter choices from the current user and keeps a separate lookup of all resolved business-unit names for displayed rows.

```typescript
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { ActivatedRoute } from '@angular/router';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { FinesFinancePayloadService } from '../services/fines-finance-payload.service';
import { IFinesFinanceInboundFilesForm } from '../services/interfaces/fines-finance-inbound-files-form.interface';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { IOpalFileHandlingInterfaceFilesRefData } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS } from '../constants/fines-finance-inbound-files-source-options.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from '../constants/fines-finance-inbound-files-type-options.constant';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from '../constants/fines-finance-inbound-files-initial-filter-state.constant';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomInboundFileViewerComponent],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly payloadService = inject(FinesFinancePayloadService);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  private readonly businessUnitRefData =
    (this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null)?.refData ?? [];
  private readonly businessUnitDisplayOptions = this.payloadService.mapBusinessUnitsToOptions(this.businessUnitRefData);
  private interfaceFilesRequest?: Subscription;
  private readonly interfaceFilesRefData = signal<IOpalFileHandlingInterfaceFilesRefData | null>(null);

  public readonly source: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS;
  public readonly sourceList: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS;
  public readonly businessUnits: IAlphagovAccessibleAutocompleteItem[] =
    this.payloadService.getPermittedBusinessUnitOptions(this.businessUnitRefData);
  public readonly refreshFailed = signal(false);
  public readonly tableData = computed(() => {
    const response = this.interfaceFilesRefData();
    return response === null
      ? null
      : this.payloadService.mapInboundFilesToTableData(response.interface_files, this.businessUnitDisplayOptions);
  });

  /**
   * Requests files for the submitted filters, cancelling any previous pending search.
   *
   * @param form - Submitted inbound-file filter data and form metadata.
   */
  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    const searchParams = this.payloadService.buildInboundFilesSearchParams(
      form.formData as IFinesFinanceInboundFilesForm,
    );

    this.interfaceFilesRequest?.unsubscribe();
    this.refreshFailed.set(false);
    this.interfaceFilesRequest = this.opalFileHandlingService
      .getInterfaceFilesRefData(searchParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.interfaceFilesRefData.set(response),
        error: () => this.refreshFailed.set(true),
      });
  }

  /**
   * Loads inbound files on page entry using Last 7 days and empty optional filters.
   */
  public ngOnInit(): void {
    this.onFormSubmit({
      formData: { ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE },
      nestedFlow: false,
    });
  }
}
```

The corresponding frontend template is:

```html
<opal-lib-custom-inbound-file-viewer
  [sourceList]="sourceList"
  [source]="source"
  [businessUnits]="businessUnits"
  [tableData]="tableData()"
  [refreshFailed]="refreshFailed()"
  (formSubmit)="onFormSubmit($event)"
></opal-lib-custom-inbound-file-viewer>
```

The payload service and constants used above are described in the [viewer overview](../readme.md#frontend-integration).
The initial call uses a copy of the initial filter state, leaving the filter component itself pristine.
The frontend clears `refreshFailed` before each request and sets it to `true` when that list request fails. The viewer
passes the flag to the filters so users can retry the same criteria without editing. A failed request leaves the last
successful rows intact; only a successful response replaces them.

## Methods and Download Behaviour

| Method or property              | Description                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canDownload(row)`              | True only for a row with a non-null ID and a display status of exactly `Ready` or `File failed`.                                                          |
| `getDownloadHref(fileId)`       | Builds `/opal-file-handling-service/interface-files/{id}/content` using the shared file-ID path helper.                                                   |
| `onDownloadFile(fileId, event)` | Rechecks the current rows, clears the previous local error, and asks FileService to download using the viewer-owned save anchor and original click event. |
| `onDownloadErrorClick(fieldId)` | Focuses the failed download link, or the results container if that link is no longer present.                                                             |
| `downloadErrors()`              | Current error-summary entries; initially empty.                                                                                                           |

The viewer requests a full Blob response with `Accept: application/octet-stream`. It supplies the row Title as the
fallback filename, or `interface-file-{id}` if Title is empty. FileService resolves any response filename/MIME preferences,
saves the original bytes and cleans up the object URL. See the [FileService README](../../../../services/file-service/readme.md)
for the exact precedence and supported transport formats.

The viewer uses the normal application HTTP interceptors and does not set an error-handling bypass. Errors forwarded to
its subscription produce `The file could not be downloaded. Try again.` in a GOV.UK error summary. The global interceptor's
existing banner/navigation/error-suppression policy still applies. The current frontend integration tests verify retained
rows for binary download failures with HTTP 404, 422 and 500.

The backend checks file existence, processing status and content availability. A visible link for `File failed`
does not guarantee the API will return content: the current content endpoint accepts only `SUCCESS` files.
Rows absent from the current table or no longer eligible for the action do not start requests; server-side availability
changes can still cause an API failure. Requests in flight are unsubscribed when the viewer is destroyed.
See the [service integration notes](../../../../services/opal-file-handling-service/readme.md#application-integration)
for the current backend permission limitation.

The component does not emit a download event to its parent, create an audit record, transform file contents or render
a preview. To customize a backend URL, filename, MIME label, request headers or response transport, use the
standalone FileService in a consumer-owned component or action template.

## Accessibility

- The page has an Inbound interface files heading and the standard visible separator after filters.
- Visible download links contain text and use a row-specific `aria-label` based on Title or File ID.
- The viewer owns a separate hidden save anchor with text content. FileService temporarily configures that anchor;
  consumers of the inbound page do not need to create or pass one.
- Download error summaries receive focus after rendering. Selecting their link returns focus to the affected row action
  or the results container.
- The common filter and table components retain their shared form labels, validation and sort/pagination behaviour.

## Testing

From the common library repository root:

```bash
yarn test --include='**/custom-inbound-file-viewer.component.spec.ts' --include='**/custom-inbound-file-viewer-download.utils.spec.ts'
```

The specs cover input/output wiring, unset/empty results, prepared row rendering, eligible actions, filename fallback,
download errors/focus, retained pagination and request cleanup. In `opal-frontend`, the Finance wrapper spec additionally
covers initial fetching, filter-to-request mapping and original binary bytes through the existing interceptors.

## Contributing

Keep API criteria and display mappings in the frontend payload service. Keep the viewer's input contract limited to
filter choices and prepared rows. Reuse FileService for file handling and the existing common filter/table components
for form and results behaviour. Update this README and the relevant specs when a public input or download contract changes.
