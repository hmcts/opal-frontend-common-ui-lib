# Custom File Interface Viewer

The file interface viewer contains inbound and outbound pages and their shared filter, table and layout components.
The frontend supplies filter choices, display-ready rows and an optional action template. The viewer renders the page;
the consuming application owns API requests, download eligibility, URLs, saving and error handling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Structure](#structure)
- [Components and Services](#components-and-services)
- [Frontend Integration](#frontend-integration)
- [Inbound Request and Display Mapping](#inbound-request-and-display-mapping)
- [Outbound Requests and Business Units](#outbound-requests-and-business-units)
- [Downloads and Errors](#downloads-and-errors)
- [Migration](#migration)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the inbound component into the consuming standalone component:

```typescript
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
```

Add `CustomInboundFileViewerComponent` to the consuming component's `imports` array and include the common library's
styles. For API requests and downloads, use the application's existing `HttpClient` provider, HTTP interceptors and API
proxy. `OpalFileHandlingService` and `FileService` are provided in root when the consuming application uses them.

## Usage

```html
<opal-lib-custom-inbound-file-viewer
  [businessUnits]="businessUnits"
  [source]="source"
  [sourceList]="sourceList"
  [tableData]="tableData()"
  [actionTemplate]="fileAction"
  (formSubmit)="onFormSubmit($event)"
></opal-lib-custom-inbound-file-viewer>
```

The variables, handler and `fileAction` template above belong to the frontend wrapper. See the
[inbound component README](./custom-inbound-file-viewer/readme.md) for their types, the row contract and an action-template
example. The optional action template defaults to `null`, leaving Action cells empty.

`source` contains source choices such as Allpay. Despite its name, `sourceList` contains file **type** choices such as
RAW and TRANSFORMED. `businessUnits` contains business-unit names and API codes.

## Structure

```text
custom-file-interface-viewer/
  common/
    custom-file-interface-viewer/               # Shared component, template and spec
    custom-file-interface-viewer-filters/       # Filter component and its support files
    custom-file-interface-viewer-table-wrapper/ # Table component, template, spec and table support files
    directives/
      custom-file-interface-viewer-base/       # Shared presentational inputs/outputs and its spec
    interfaces/                                # Shared prepared-row contract
  constants/                                   # Public filter labels
  custom-inbound-file-viewer/                  # Wrapper, template, spec and inbound contracts
  custom-outbound-file-viewer/                 # Wrapper, template, spec and outbound contracts
```

Every component owns its matching `.component.ts`, `.component.html` and `.component.spec.ts` files. The base directive
owns its `.directive.ts` and `.directive.spec.ts` files under `common/directives/`. The shared package entrypoint is
`common/public-api.ts`; the viewer, table, base directive and row/action contracts are imported from that entrypoint.
The filter keeps its existing dedicated entrypoint, and each direction retains its public wrapper entrypoint.

## Components and Services

| Component or service                                    | Responsibility                                                                               | Documentation                                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `CustomInboundFileViewerComponent` | Thin wrapper selecting inbound filters, columns and default sorting. | [Inbound viewer](./custom-inbound-file-viewer/readme.md) |
| `CustomOutboundFileViewerComponent` | Thin wrapper selecting outbound filters and columns. | [Outbound viewer](./custom-outbound-file-viewer/readme.md) |
| `CustomFileInterfaceViewerBase<TFile>` | Common presentational inputs, typed action context and submission output. | [Viewer base](./common/directives/custom-file-interface-viewer-base/readme.md) |
| `CustomFileInterfaceViewerComponent` | Shared heading, filters, results/empty state and supplied row actions. | [Shared viewer](./common/custom-file-interface-viewer/readme.md) |
| `CustomFileInterfaceViewerFiltersComponent` | Filter controls, validation and submission of raw form values. | [Common filters](./common/custom-file-interface-viewer-filters/readme.md) |
| `CustomFileInterfaceViewerTableWrapperComponent` | Rendering, sorting, 25-row pagination and caller-supplied action templates. | [Common table](./common/custom-file-interface-viewer-table-wrapper/readme.md) |
| `OpalFileHandlingService`                               | HTTP calls for the file list, one file's metadata and one file's original content.           | [API service](../../../services/opal-file-handling-service/readme.md)                                            |
| `FileService`                                           | Generic file content handling and saving through a caller-owned anchor.                      | [File service](../../../services/file-service/readme.md)                                                         |
| Frontend payload service and page helpers                | Permission-based filter choices, API criteria, reference labels and row/date/status mapping. | [Frontend integration](#frontend-integration)                                                                    |

The direction-specific wrappers compose `opal-lib-custom-file-interface-viewer`, which owns the shared page markup.
The inbound and outbound wrappers provide direction-specific convenience APIs. Each routed Finance page uses the shared
entrypoint directly in its template and supplies its action template, error summary and save anchor. A shared frontend
base directive handles searches and downloads for both directions.

The inbound wrapper supplies `isInbound=true` to the shared viewer; the outbound wrapper supplies `false`.
The inbound page has no `isInbound`, `domain` or raw `interfaceFilesRefData` input. Domain belongs in the frontend's API
criteria. The common filters retain their own `isInbound` input to control source and file-type filter visibility.

The wrappers and base directive declare no imperative methods; inputs, outputs and templates provide their shared
contract. Component lifecycle and handler responsibilities are documented with the
[filter methods](./common/custom-file-interface-viewer-filters/readme.md#methods),
[table methods](./common/custom-file-interface-viewer-table-wrapper/readme.md#methods) and
[date-filter methods](../custom-date-filter/README.md#methods).

## Frontend Integration

The current implementation in `opal-frontend` is under `src/app/flows/fines/fines-finance`:

| Frontend file or area                                                              | What it supplies                                                                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `fines-finance-inbound-files` and `fines-finance-outbound-files` | Separate routed pages supplying direction-specific filters and row mappings; templates render the library viewer, actions, error summary and save anchor directly. |
| `directives/fines-finance-interface-files-base` | Initial and Refresh searches, submitted-filter snapshots, cancellation, permitted business units, computed rows, download eligibility, original-content requests, errors and focus. |
| `services/fines-finance-interface-files-payload.service.ts` and `services/utils` | Shared permitted business-unit choices, code-to-name lookup, date-filter and row-mapping helpers. |
| Each file page's `constants` and `utils` | Direction-specific choices, codes, request scope, query and row mapping; outbound response selection. Inbound also owns its filter/mapping `interfaces`. |
| Finance-level `constants`, `interfaces` and `types` | Shared domain/status/date settings, default filters, filter contract and date/time mapping types. |
| `routing/fines-finance.routes.ts` | Inbound/outbound routes, View Interface Files permission and business-unit reference-data resolver. |
| `src/app/flows/fines/routing/fines.routes.ts`                                      | Banking interfaces release flag on the Finance parent route through `canActivate` and `canActivateChild`.           |

Finance owns the routes, navigation links and separate upload page. Shared directives, constants, interfaces and services sit directly under Finance alongside the two file pages. Direction-specific constants, contracts and utilities stay under their owning page. The base directive has no template; each page owns its markup and calls its local query/mapping helpers with `DateService`.

The frontend integration needs the following data and behaviour:

1. Resolve business-unit reference data before constructing the page. Filter choices must contain only business units
   where the user has View Interface Files permission, sorted by name. Use the business-unit **code** as the option value,
   preserving leading zeros; use the business-unit name as the option label.
2. Keep a complete code-to-name lookup for mapping returned rows. That lookup can be broader than the permitted filter
   choices. The list API returns codes, not names.
3. Supply canonical source and file-type options. The filter adds the three All choices itself, so do not duplicate
   those options in the supplied arrays. Replacing any option array clears a removed selection to `null`; valid choices,
   the explicit All value `''` and control interaction state are preserved.
4. Build API criteria in each frontend page's query helper, reusing shared date/filter helpers. The filter output contains UI field names and is not an API payload.
5. Fetch the list on page entry. The viewer does not emit an initial search automatically. The frontend's `ngOnInit`
   initiates the initial Last 7 days request. Refresh remains enabled, including when filters are pristine; submitting
   runs validation and forwards valid form values.
6. Map successful API results to table rows and replace the supplied row array. Keep `tableData=null` before the first
   response and use `[]` for a completed empty response. Handle request failures in the consuming application and retain
   the last successful rows when a request fails. Unchanged criteria can be resubmitted without a failure input.
7. Cancel superseded or destroyed requests. The shared Finance base directive cancels the preceding subscription and uses
   `takeUntilDestroyed` to prevent an older search from replacing newer results.
8. Keep authentication, permissions and release-flag checks in the normal frontend routes and services. Passing filter
   options to this component does not enforce backend access control.

## Inbound Request and Display Mapping

The current Finance inbound query helper always adds this scope:

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

| UI value                              | API criterion                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| Selected business-unit code           | `business_unit_code`                                                                   |
| Selected source code                  | `source`                                                                               |
| RAW                                   | `type: ['SOURCE']`                                                                     |
| TRANSFORMED                           | `type: ['TRANSFORMED_JSON']`                                                           |
| Last 7 days or custom days            | Inclusive date criteria calculated using the existing report/date helpers.             |
| From and/or To date                   | Inclusive local calendar boundaries converted to UTC for `from_date` and/or `to_date`. |
| Blank or explicit All dropdown choice | Omit that optional selection; retain the fixed inbound scope above.                    |

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

Pass prepared display rows to `tableData`, rather than raw API records. The viewer renders the supplied status text;
the consuming action template decides whether any action is available for that row. Every displayed column is sortable,
including the final Action column in both directions. The caller supplies its `Actions` sort label separately from
the template; Finance supplies `Download` for an eligible row and an empty string otherwise. The library applies no
status-based eligibility rules.

## Outbound Requests and Business Units

Outbound criteria use `domain: 'FINES'`, `source: 'OPAL'`, `not_target: 'OPAL'` and
`not_status: ['FAILED_SUPERSEDED']`. Date boundaries use the same shared helper as inbound searches.

The current backend business-unit predicate excludes records without a business unit. Finance therefore omits
`business_unit_code` for outbound requests and applies the submitted selection to the response, retaining files that
match the selected code or have null/empty `business_unit_codes`. Inbound requests continue to send their selected
business-unit code to the API. The shared search lifecycle captures the submitted filters so later edits cannot alter
which returned outbound files are displayed.

## Downloads and Errors

Supply `[actionTemplate]` to render row actions. The inbound viewer passes the template unchanged to the table, where
`let-row` receives the current row. There is no default Download link or status-based eligibility rule.

The consuming application decides which rows can be downloaded, constructs URLs and handles clicks, requests, filenames,
errors and focus. It can reuse [FileService](../../../services/file-service/readme.md) with its own save anchor, click event
and download options. For File Handling Service endpoints and response formats, see the
[API service documentation](../../../services/opal-file-handling-service/readme.md).

Keep application HTTP interceptors in use. Any local download error summary, its focus after rendering and focus restoration
to the affected action belong to the consumer. The viewer does not subscribe to downloads or modify rows when an action
is selected; any changes follow the consuming application's handler.

## Migration

Before adopting this version in a consuming application:

1. Remove `[refreshFailed]` bindings from inbound viewers and common filters. The input has been removed; Refresh is
   always enabled and validates on submission.
2. Supply `[actionTemplate]` when row actions are required. Move the former download eligibility, URL construction,
   requests, save anchor, errors and focus handling into the application. Without a template, Action cells remain empty.

Update consumer integration tests alongside the package upgrade. The former built-in download methods and error state
are no longer part of the inbound viewer.

## Testing

The component specs are beside their implementations. From the library repository root:

```bash
yarn test --include='**/custom-file-interface-viewer/**/*.spec.ts'
yarn test:coverage --include='**/custom-file-interface-viewer/**/*.spec.ts' --coverage-include='projects/opal-frontend-common/components/custom/custom-file-interface-viewer/**/*.ts'
```

Consumer integration tests should cover initial fetching, real filter-widget submissions, payload mapping and any
application-owned downloads, errors and focus. Update existing disabled-Refresh assertions and download tests when
migrating. Route and dashboard specs cover release-flag wiring, permissions and navigation links.

## Contributing

Keep domain-specific request and row mappings in the consuming frontend's page utilities. Reuse the
existing date, form and table abstractions. Document public input or action-template changes in the component and
service READMEs, and update the relevant colocated specs.
