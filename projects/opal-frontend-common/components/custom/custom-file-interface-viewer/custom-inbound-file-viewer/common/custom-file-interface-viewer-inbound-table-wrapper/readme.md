# Custom File Interface Viewer Inbound Table Wrapper Component

This standalone component renders the inbound interface files table with column sorting, client-side pagination and
a caller-supplied action template. It extends `AbstractReportInstancesTableBaseComponent`, the same base used by reporting
tables. It does not fetch records or download files.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Table Data and Actions](#table-data-and-actions)
- [Methods and Pagination](#methods-and-pagination)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Use the existing inbound viewer entrypoint:

```typescript
import {
  CustomFileInterfaceViewerInboundTableWrapperComponent,
  CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT,
  ICustomFileInterfaceViewerInboundTableWrapperTableData,
  ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext,
  ICustomFileInterfaceViewerInboundTableWrapperTableSort,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
```

Add `CustomFileInterfaceViewerInboundTableWrapperComponent` to the consuming standalone component's `imports` array.

The implementation and colocated spec live in this directory beneath the inbound viewer.

For the complete inbound page with filters and download links, use
[CustomInboundFileViewerComponent](../../readme.md).

## Usage

A minimal standalone host can supply a row and its own action:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CustomFileInterfaceViewerInboundTableWrapperComponent,
  CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT,
  ICustomFileInterfaceViewerInboundTableWrapperTableData,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';

@Component({
  selector: 'app-interface-file-table-example',
  imports: [CustomFileInterfaceViewerInboundTableWrapperComponent],
  template: `
    <ng-template #fileAction let-row>
      <a [href]="'/files/' + row['File ID']" [attr.aria-label]="'Open ' + row.Title">Open file</a>
    </ng-template>
    <opal-lib-custom-file-interface-viewer-inbound-table-wrapper
      [tableData]="rows"
      [existingSortState]="sortState"
      [actionTemplate]="fileAction"
    ></opal-lib-custom-file-interface-viewer-inbound-table-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceFileTableExampleComponent {
  public readonly sortState = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;
  public readonly rows: ICustomFileInterfaceViewerInboundTableWrapperTableData[] = [
    {
      'File ID': 1001,
      'Date and time': 1792497600000,
      dateTimeDisplay: '20 Oct 2026 at 13:00',
      Title: 'allpay_1001.xml',
      Type: 'RAW',
      'Business unit': 'Camberwell Green',
      Source: 'Allpay',
      Status: 'Ready',
      Actions: null,
    },
  ];
}
```

The `/files/{id}` link above is an illustrative consumer route, not a route provided by this component or the File Handling
Service. The table renders the supplied template unchanged. For a backend download, the consuming template and handler
must supply the URL, click event and saving behaviour; the inbound viewer already does this using FileService.

## Inputs

| Input                 | Type                                                                                      | Required | Default                                       | Description                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------- | -------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `tableData`           | `ICustomFileInterfaceViewerInboundTableWrapperTableData[]`                                | Yes      | Supply `[]` for no rows.                      | The inherited input setter updates table data, reapplies sorting and resets the page.                                                     |
| `existingSortState`   | `ICustomFileInterfaceViewerInboundTableWrapperTableSort \| null`                          | Yes      | Supply the exported default for newest first. | Sets inherited sort configuration; `null` leaves no supplied sort configuration.                                                          |
| `actionTemplate`      | `TemplateRef<ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext> \| null` | No       | `null`                                        | Template to render in each Action cell. A null value leaves that cell empty.                                                              |
| `paginationPageTitle` | `string`                                                                                  | No       | `''`                                          | Inherited context for the page-change announcement signal. The current table template does not render that signal as its own live region. |

`CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT` sorts `'Date and time'` descending, with all other
directions set to `'none'`. Six displayed data columns are sortable: Date and time, Title, Type, Business unit, Source
and Status. The Action header is not sortable.

## Outputs

The wrapper adds no new outputs and inherits the sortable-table output:

| Output              | Type                               | Description                                                                         |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `abstractSortState` | `EventEmitter<IAbstractSortState>` | Emits the updated column sort-state map so a caller can observe or persist sorting. |

The base table can emit this output during sort initialization and reapplication as well as user sorting.
Import `IAbstractSortState` from `@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces`.
The inbound viewer does not forward this event as a parent output. The table handles pagination internally;
action events belong to the consuming template, as shown in the usage example.

## Table Data and Actions

The complete row shape is documented in the [inbound viewer README](../../readme.md#table-data).
Supply numeric epoch milliseconds for `'Date and time'` and already formatted text for `dateTimeDisplay`.
The table performs no date parsing, reference-name resolution, status mapping or download-eligibility checks.

The action context has one property:

```typescript
interface ICustomFileInterfaceViewerInboundTableWrapperActionTemplateContext {
  $implicit: ICustomFileInterfaceViewerInboundTableWrapperTableData;
}
```

Consequently `let-row` receives the current row. The `Actions` string field is not inserted into the Action cell.
The inbound viewer's template displays Download only for a non-null file ID with `Ready` or `File failed` status.

Rows are tracked by `'File ID'`; provide unique IDs to keep rendered rows stable.

## Methods and Pagination

The component's `existingSortState` setter configures the inherited sort state. Sorting and pagination use the existing
reporting/table base methods:

| Method or property                | Behaviour                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `onSortChange({ key, sortType })` | Applies ascending/descending sorting and returns to page 1.                                    |
| `onPageChange(page)`              | Clamps the requested page and focuses the first row after a different page is rendered.        |
| `onApplyFilters()`                | Reapplies inherited table filtering/sorting and returns to page 1. The data setter invokes it. |
| `paginatedTableDataComputed()`    | Supplies the sorted rows for the current page.                                                 |
| `itemsPerPageSignal()`            | The concrete wrapper sets the page size to 25.                                                 |

Pagination controls appear only when there are more than 25 rows. Smaller result sets show a result count.
Pagination is client-side over the supplied array; the component does not make server-page requests or interpret an API
`number_of_results` value.

## Accessibility

The table provides a visually hidden Inbound interface files caption, sortable headers and the shared sort-status
component. It uses the horizontal scroll pane and shared MoJ pagination components. Page changes focus the first rendered
row through the pagination base class.

Keep action links keyboard accessible and give repeated actions a row-specific accessible name. The table does not add
labels, click prevention or error handling to a supplied action template.

## Testing

The implementation and spec are colocated beneath `custom-inbound-file-viewer/common`. From the library repository root:

```bash
yarn test --include='**/custom-file-interface-viewer-inbound-table-wrapper.component.spec.ts'
```

The spec covers input replacement, default/date and column sorting, 25-row page boundaries, page reset/focus and
caller-owned action templates. The existing abstract reporting/table base classes have their own specs.

## Contributing

Keep list requests and row mappings in the consumer's payload/API layers. Keep file saving and response-format handling
in FileService. Reuse the existing table base rather than duplicating data-input, sort or pagination state.
