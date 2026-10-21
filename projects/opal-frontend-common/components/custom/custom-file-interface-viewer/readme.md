# Custom File Interface Viewer

The file interface viewer contains the inbound files page and the filter and table components used by that page.
The frontend supplies filter choices and display-ready rows. The viewer renders the page and uses the standalone
`FileService` to download a selected file from the File Handling Service.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components and Services](#components-and-services)
- [Frontend Integration](#frontend-integration)
- [Inbound Request and Display Mapping](#inbound-request-and-display-mapping)
- [Downloads and Errors](#downloads-and-errors)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the inbound component into the consuming standalone component:

```typescript
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
```

Add `CustomInboundFileViewerComponent` to the consuming component's `imports` array. Use the application's existing
`HttpClient` provider and HTTP interceptors. The services are provided in root; they do not need component-level providers.

The application also needs the common library's styles, its normal router setup, and access to the existing
`/opal-file-handling-service` API proxy. The current `opal-frontend` application already provides that infrastructure.

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

The variables and handler above belong to the frontend wrapper. See the
[inbound component README](./custom-inbound-file-viewer/readme.md) for their types, the row contract and a complete
frontend wrapper example.

`source` contains source choices such as Allpay. Despite its name, `sourceList` contains file **type** choices such as
RAW and TRANSFORMED. `businessUnits` contains business-unit names and API codes.

## Components and Services

| Component or service                                    | Responsibility                                                                                      | Documentation                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `CustomInboundFileViewerComponent`                      | Page heading, filters, separator, results/empty state, eligible download links and download errors. | [Inbound viewer](./custom-inbound-file-viewer/readme.md)                              |
| `CustomFileInterfaceViewerFiltersComponent`             | Filter controls, validation, Refresh state and submission of raw form values.                       | [Common filters](./common/custom-file-interface-viewer-filters/readme.md)             |
| `CustomFileInterfaceViewerInboundTableWrapperComponent` | Rendering, sorting, 25-row pagination and caller-supplied action templates.                         | [Common table](./common/custom-file-interface-viewer-inbound-table-wrapper/readme.md) |
| `OpalFileHandlingService`                               | HTTP calls for the file list, one file's metadata and one file's original content.                  | [API service](../../../services/opal-file-handling-service/readme.md)                 |
| `FileService`                                           | Generic file content handling and saving through a caller-owned anchor.                             | [File service](../../../services/file-service/readme.md)                              |
| Frontend payload service                                | Permission-based filter choices, API criteria, reference labels and row/date/status mapping.        | [Frontend integration](#frontend-integration)                                         |

There is no parent component selector named `opal-lib-custom-file-interface-viewer`. Use the inbound component selector
shown above, or import the common filter/table separately when building another screen.

The current page is specifically the inbound page. It supplies `isInbound=true` to its internal filter component.
The inbound page has no `isInbound`, `domain` or raw `interfaceFilesRefData` input. Domain belongs in the frontend's API
criteria. The common filters retain their own `isInbound` input to control source and file-type filter visibility.

## Frontend Integration

The current implementation in `opal-frontend` is under `src/app/flows/fines/fines-finance`:

| Frontend file or area                                                              | What it supplies                                                                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `fines-finance-inbound-files/fines-finance-inbound-files.component.ts` and `.html` | Inputs for the library component, initial request on page entry, Refresh requests, cancellation and computed rows.  |
| `services/fines-finance-payload.service.ts` and `services/utils`                   | Request construction, permitted business-unit choices and API-to-table mappings using existing report/date helpers. |
| `constants/fines-finance-inbound-files-*.constant.ts`                              | Source/type choices, initial filters, request scope and display mappings.                                           |
| `routing/fines-finance.routes.ts`                                                  | Inbound route, View Interface Files permission and business-unit reference-data resolver.                           |
| `src/app/flows/fines/routing/fines.routes.ts`                                      | Banking interfaces release flag on the Finance parent route through `canActivate` and `canActivateChild`.           |

The frontend integration needs the following data and behaviour:

1. Resolve business-unit reference data before constructing the page. Filter choices must contain only business units
   where the user has View Interface Files permission, sorted by name. Use the business-unit **code** as the option value,
   preserving leading zeros; use the business-unit name as the option label.
2. Keep a complete code-to-name lookup for mapping returned rows. That lookup can be broader than the permitted filter
   choices. The list API returns codes, not names.
3. Supply canonical source and file-type options. The filter adds the three All choices itself, so do not duplicate
   those options in the supplied arrays.
4. Build API criteria in the frontend payload service. The filter output contains UI field names and is not an API payload.
5. Fetch the list on page entry. The viewer does not emit an initial search automatically; its Refresh button starts
   disabled while the form is pristine. The frontend's `ngOnInit` initiates the initial Last 7 days request.
6. Map successful API results to table rows and replace the supplied row array. Keep `tableData=null` before the first
   response and use `[]` for a completed empty response. Clear `refreshFailed` before each list request and set it to
   `true` on failure so pristine filters can retry unchanged criteria. Retain the last successful rows when a request fails.
7. Cancel superseded or destroyed requests. The existing Finance wrapper cancels the preceding subscription and uses
   `takeUntilDestroyed` to prevent an older search from replacing newer results.
8. Keep authentication, permissions and release-flag checks in the normal frontend routes and services. Passing filter
   options to this component does not enforce backend access control.

## Inbound Request and Display Mapping

The current Finance payload service always adds this inbound scope:

```typescript
const inboundScope = {
  domain: 'FINES',
  target: 'OPAL',
  type: ['SOURCE', 'TRANSFORMED_JSON'],
  not_status: ['FAILED_SUPERSEDED'],
};
```

These are API restrictions, not default selections in the dropdowns. Only Last 7 days is selected initially.
`SOURCE_JSON` is excluded by the allowed type list.

| UI value                              | API criterion                                                              |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Selected business-unit code           | `business_unit_code`                                                       |
| Selected source code                  | `source`                                                                   |
| RAW                                   | `type: ['SOURCE']`                                                         |
| TRANSFORMED                           | `type: ['TRANSFORMED_JSON']`                                               |
| Last 7 days or custom days            | Inclusive date criteria calculated using the existing report/date helpers. |
| From and/or To date                   | Inclusive local calendar boundaries converted to UTC for `from_date` and/or `to_date`. |
| Blank or explicit All dropdown choice | Omit that optional selection; retain the fixed inbound scope above.        |

The frontend uses `DateService` to parse the selected local calendar dates, takes `startOf('day')` for `from_date`
and `endOf('day')` for `to_date`, then converts each boundary to UTC. It formats UTC timestamps as
`yyyy-MM-dd'T'HH:mm:ss` without an offset suffix and appends `.999999` to `to_date` to include the final database
microsecond. For 14–20 October 2026 in Europe/London, the query is `from_date=2026-10-13T23:00:00` and
`to_date=2026-10-20T22:59:59.999999`. The conversion uses the user's local zone rather than a fixed offset.

The API service serializes array criteria into comma-separated query values. See its
[parameter documentation](../../../services/opal-file-handling-service/readme.md) for the supported fields.

The current Finance source choices are Allpay, Allpay DD, NatWest, Barclaycard, BT Eckoh, DWP, Cder, Marston, Jacobs,
BT Eckoh Report and CAPS Report. Variant Banking is not included in the inbound source choices.

Map API metadata before passing it to the viewer:

- `interface_file_id` becomes `'File ID'`.
- `created_datetime` becomes numeric epoch milliseconds in `'Date and time'` and local display text in `dateTimeDisplay`.
  The current format is `dd MMM yyyy 'at' HH:mm`. The Finance mapper treats timestamps without an offset as UTC and uses
  the existing `DateService` for parsing and formatting.
- `file_name` becomes `Title`.
- `business_unit_codes` become names joined with `, `, using resolved reference data.
- API source/type codes become the labels from the canonical choices.
- Status codes become display labels. In the current Finance mapping, `SUCCESS`, `SUCCESS_NO_TRANSACTIONS`, `DUPLICATE`
  and `SUPERSEDED` become `Ready`; `FAILED` and `FAILED_SUPERSEDED` become `File failed`; `INGESTED` becomes `In-Progress`.
  Unknown values are retained. `FAILED_SUPERSEDED` is excluded by the standard inbound request.

Do not pass raw API records or raw status codes to `tableData`. Download visibility uses the prepared row's display status.

## Downloads and Errors

The inbound viewer creates a Download link for a row with a non-null file ID and a status of exactly `Ready` or
`File failed`. An `In-Progress` row has no download link. This is UI eligibility; the backend decides whether the
requested file actually exists and is currently available.

Selecting a link requests `GET /opal-file-handling-service/interface-files/{id}/content` with
`Accept: application/octet-stream` and a Blob response. The viewer passes the URL, click event and its own native save
anchor to `FileService`. The file's Title is the fallback filename; if it is absent, the fallback is `interface-file-{id}`.
Response filename headers and content bytes are handled by `FileService`.

The existing application interceptors remain in use. The viewer shows a GOV.UK error summary for download errors
forwarded to its subscription, focuses the summary, and lets its link return focus to the affected row or results
container. Global HTTP error handling can also show its normal banner or apply its existing navigation policy.
The viewer does not override that policy.

Downloading does not replace the table rows, reset pagination or mark a row as busy. The component does not create
download audit records, preview file content or convert file formats.

## Testing

The component and utility specs are beside their implementations. From the library repository root:

```bash
yarn test --include='**/custom-file-interface-viewer/**/*.spec.ts'
yarn test:coverage --include='**/custom-file-interface-viewer/**/*.spec.ts' --coverage-include='projects/opal-frontend-common/components/custom/custom-file-interface-viewer/**/*.ts'
```

In `opal-frontend`, the inbound wrapper spec covers initial fetching, real filter-widget submissions, payload mapping,
binary downloads through the existing interceptors and retained rows after download failures. Route and dashboard
specs cover release-flag wiring, permissions and navigation links.

## Contributing

Keep domain-specific request and row mappings in the consuming frontend's payload service and utilities. Reuse the
existing date, form and table abstractions. Document public input or download-contract changes in the component and
service READMEs, and update the relevant colocated specs.
