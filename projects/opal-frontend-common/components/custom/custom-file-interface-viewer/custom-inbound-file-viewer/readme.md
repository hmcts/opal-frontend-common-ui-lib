# Custom Inbound File Viewer Component

This standalone Angular component renders the Inbound interface files heading, common filters, visible section
separator, sortable results table, empty state and caller-supplied row actions. It accepts display-ready data and an
optional action template from the consuming application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Table Data](#table-data)
- [Action Template Contract](#action-template-contract)
- [Migration](#migration)
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

Add `CustomInboundFileViewerComponent` to the consuming standalone component's `imports` array and include the common
library styles. The consuming application's API and download handlers use its existing HTTP providers and interceptors.

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

The `fileAction` template belongs to the consuming application; see the [action contract](#action-template-contract).
Omit `actionTemplate` to leave Action cells empty.

The [viewer overview](../readme.md) explains frontend routes, reference data, permissions, request scope and mappings.
The common [filters](../common/custom-file-interface-viewer-filters/readme.md) and
[table](./common/custom-file-interface-viewer-inbound-table-wrapper/readme.md) have separate API documentation.

## Inputs

| Input            | Type                                                                                      | Required | Default | Description                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------- |
| `businessUnits`  | `IAlphagovAccessibleAutocompleteItem[]`                                                   | Yes      | `[]`    | Permitted filter choices: business-unit names as `name`, string API codes as `value`. |
| `source`         | `IAlphagovAccessibleAutocompleteItem[]`                                                   | Yes      | `[]`    | Source choices, for example `{ name: 'Allpay', value: 'ALLPAY' }`.                    |
| `sourceList`     | `IAlphagovAccessibleAutocompleteItem[]`                                                   | Yes      | `[]`    | File-type choices, for example RAW/SOURCE and TRANSFORMED/TRANSFORMED_JSON.           |
| `tableData`      | `ICustomFileInterfaceViewerInboundTableWrapperTableData[] \| null`                        | No       | `null`  | Prepared rows. `null` leaves results unset; `[]` shows the completed empty state.     |
| `actionTemplate` | `TemplateRef<ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext> \| null` | No       | `null`  | Passed unchanged to the table for each Action cell. A null value leaves cells empty.  |

A required input must still be bound when its value is an empty array. The internal filter always uses inbound mode.
The application supplies any download URLs and behaviour through `actionTemplate`; the viewer has no built-in download
action or status-eligibility rule.

## Outputs

| Output       | Type                                           | Description                                                                                                   |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `formSubmit` | `EventEmitter<IAbstractFormBaseForm<unknown>>` | Forwards a valid filter submission. `formData` contains the raw UI filter values and `nestedFlow` is `false`. |

The frontend handles this event, builds API parameters, requests data and maps the response. The viewer does not
filter the input rows itself or issue list API calls. Sorting and pagination operate on the rows already supplied.

No initial `formSubmit` event is emitted. The frontend must start the initial request when the page is entered.
Refresh is always enabled, including for pristine filters, and validates on submission. Invalid forms show validation
errors without emitting `formSubmit`; valid forms can resubmit unchanged criteria. Handle request errors in the
application and retain the last successful rows as appropriate.
See the [filter form contract](../common/custom-file-interface-viewer-filters/readme.md) for fields and defaults.

## Table Data

Import the row interface from the inbound viewer entrypoint shown above. Each row contains:

| Property          | Type             | Description                                                                                                         |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `'File ID'`       | `number \| null` | Identifier available to the consuming action template; the viewer applies no eligibility check.                     |
| `'Date and time'` | `number \| null` | Epoch milliseconds for chronological sorting.                                                                       |
| `dateTimeDisplay` | `string \| null` | Already formatted local date/time text shown in the cell.                                                           |
| `Title`           | `string \| null` | Display title, available to the consuming action template.                                                          |
| `Type`            | `string \| null` | Display label such as RAW or TRANSFORMED.                                                                           |
| `'Business unit'` | `string \| null` | Resolved business-unit name or joined names.                                                                        |
| `Source`          | `string \| null` | Source display label.                                                                                               |
| `Status`          | `string \| null` | Display label for the status cell; any action eligibility belongs to the consumer.                                  |
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
row array reapplies sorting and resets the current page. Row actions do not change the array unless the consumer does so.

## Action Template Contract

The exported context type is:

```typescript
interface ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext {
  $implicit: ICustomFileInterfaceViewerInboundTableWrapperTableData;
}
```

Import this type from the same inbound viewer entrypoint when declaring a typed `TemplateRef`. In an Angular template,
`let-row` receives the full current row. The viewer passes `actionTemplate` unchanged to its table and supplies no default
contents for the Action cell. The row's `Actions` string is not rendered as an action.

For example, define this template in the consuming component and bind `[actionTemplate]="fileAction"` as shown above:

```html
<ng-template #fileAction let-row>
  @if (canDownload(row)) {
  <a
    class="govuk-link"
    [id]="'interface-file-download-' + row['File ID']"
    [href]="getDownloadHref(row)"
    [attr.aria-label]="'Download ' + (row.Title || 'interface file ' + row['File ID'])"
    (click)="onDownloadFile(row, $event)"
  >
    Download
  </a>
  }
</ng-template>
```

`canDownload`, `getDownloadHref` and `onDownloadFile` are application-owned methods that the consuming component must
provide; they are not viewer methods. The application chooses eligible IDs/statuses and endpoints, handles the click and
request, and supplies any filename, headers and response options. It can use the standalone
[FileService](../../../../services/file-service/readme.md) with its own save anchor. Backend availability and permissions
must still be enforced by the backend.

The consumer also owns request cancellation, error state and rendering, and focus after an error or selection from an
error summary. The viewer does not inject a download service, create a save anchor, handle action errors or issue API
requests. Keep initial fetching, filter-to-request mapping and prepared row construction in the consuming wrapper and
payload service, as described in the [viewer overview](../readme.md#frontend-integration).

## Migration

Before upgrading a consuming application, remove `[refreshFailed]` bindings from the inbound viewer and common filters.
Refresh is always enabled and validates on submission, so no request-failure input is needed to retry unchanged filters.

Supply `[actionTemplate]` to retain row actions. Move download eligibility, URL construction, requests, save-anchor setup,
errors and focus handling into the consuming application. The former built-in Download action and download methods/error
state have been removed; omitting the template leaves Action cells empty. Update the consumer's tests with this migration.

## Accessibility

- The page has an Inbound interface files heading and the standard visible separator after filters.
- The common filter and table components retain their shared form labels, validation and sort/pagination behaviour.
- Keep supplied action links keyboard accessible and give repeated actions a row-specific accessible name.
- The consumer owns download error summaries and their focus management. The results container has
  `id="inbound-interface-files-results"` and `tabindex="-1"` if the consumer needs a fallback focus target.

## Testing

From the common library repository root:

```bash
yarn test --include='**/custom-inbound-file-viewer.component.spec.ts'
```

The specs cover input/output wiring, unset/empty results, prepared row rendering and caller-supplied action templates.
Table sorting and pagination have colocated wrapper specs. Consumer integration tests should cover initial fetching,
filter-to-request mapping and any application-owned eligibility, downloads, errors and focus.

## Contributing

Keep API criteria, display mappings and action behaviour in the consuming application. Reuse FileService for file
handling where appropriate and the existing common filter/table components for form and results behaviour. Update this
README and the relevant specs when a public input or action-template contract changes.
