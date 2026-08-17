# Abstract Sortable Table Pagination Component

This Angular component extends the functionality of the `AbstractTableFilterComponent` to include pagination capabilities. It provides reusable logic for handling table data sorting and pagination, making it ideal for components that require both functionalities. It inherits sorting logic from `AbstractSortableTableComponent` and uses filtered and sorted data for pagination.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Focus Behaviour](#focus-behaviour)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Mocks](#mocks)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractSortableTablePaginationComponent` in your project, extend it in your custom table components to manage sorting and pagination in your Angular application.

```typescript
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/abstract';
```

## Usage

This component is designed to be used as a base class for managing sorting and pagination in a reusable and scalable way. It inherits sorting capabilities from `AbstractSortableTableComponent` and applies pagination on the filtered and sorted dataset.

### Dynamic Data

If the table data is fetched asynchronously, ensure that `sortedTableDataSignal` is updated reactively:

```typescript
fetchData(): void {
  this.isLoading = true;
  this.error = null;

  fetch('/api/data')
    .then((response) => response.json())
    .then((data) => {
      this.sortedTableDataSignal.set(data);
      this.isLoading = false;
    })
    .catch((err) => {
      this.error = 'Failed to load data.';
      this.isLoading = false;
    });
}

```

### Example Usage:

#### Connecting a Pagination Control

`AbstractSortableTablePaginationComponent` does not render or depend on a particular pagination control. The consuming
component must connect a pagination control to the inherited page state and `onPageChange()` handler.

The example below uses `MojPaginationComponent`, which is the pagination control currently used by OPAL Frontend. Its
`currentPage`, `limit`, and `total` inputs are connected to the table state, while its `changePage` event calls the
abstract class's `onPageChange()` method. This updates the announcement and `currentPageSignal` before moving focus after
the new rows render.

```typescript
@Component({
  selector: 'app-sortable-table-pagination',
  templateUrl: './sortable-table-pagination.component.html',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojPaginationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableTablePaginationComponent extends AbstractSortableTablePaginationComponent {
  // Define the full dataset for the table (Angular Signal for reactivity)
  public sortedTableDataSignal = signal([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'Diana', age: 28 },
    { name: 'Eve', age: 32 },
  ]);

  // Initial sort state for the columns
  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };

  constructor() {
    super();
    // Signals to manage pagination
    this.currentPageSignal = signal(1);
    this.itemsPerPageSignal = signal(5);
  }
}
```

```html
<p role="status" aria-atomic="true" class="govuk-visually-hidden">{{ pageChangeAnnouncement() }}</p>

<opal-lib-moj-sortable-table>
  <ng-container head>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="name"
      [sortDirection]="sortStateSignal()['name']"
      (sortChange)="onSortChange($event)"
    >
      Name
    </th>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="age"
      [sortDirection]="sortStateSignal()['age']"
      (sortChange)="onSortChange($event)"
    >
      Age
    </th>
  </ng-container>
  <ng-container row>
    @for (row of paginatedTableDataComputed(); track row['name']) {
    <tr opal-lib-moj-sortable-table-row>
      <td #paginationFocusTarget opal-lib-moj-sortable-table-row-data id="name">{{ row['name'] }}</td>
      <td opal-lib-moj-sortable-table-row-data id="defendant">{{ row['age'] }}</td>
    </tr>
    }
  </ng-container>
</opal-lib-moj-sortable-table>
@if (sortedTableDataSignal()!.length > paginatedTableDataComputed().length) {
<opal-lib-moj-pagination
  id="sortable-table-pagination"
  [currentPage]="currentPageSignal()"
  [limit]="itemsPerPageSignal()"
  [total]="sortedTableDataSignal().length"
  (changePage)="onPageChange($event)"
></opal-lib-moj-pagination>
}
```

When the table wrapper itself is consumed by another component, the optional title can be supplied as an input:

```html
<app-sortable-table-pagination paginationPageTitle="Search results"></app-sortable-table-pagination>
```

## Inputs

The following signals and computed properties are available to manage table data and pagination:

### Signals

| Input                    | Type                           | Description                                                         |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------- |
| `currentPageSignal`      | `signal<number>`               | Tracks the current page in the pagination.                          |
| `itemsPerPageSignal`     | `signal<number>`               | Specifies the number of items per page.                             |
| `sortedTableDataSignal`  | `signal<IAbstractTableData[]>` | Holds the sorted dataset for the table, updated reactively.         |
| `pageChangeAnnouncement` | `signal<string>`               | Exposes announcement text for the consuming template's live region. |

### Component Inputs

| Input                 | Type     | Required | Description                                                               |
| --------------------- | -------- | -------- | ------------------------------------------------------------------------- |
| `paginationPageTitle` | `string` | No       | Title included in the page-change announcement exposed by the base class. |

### Computed Properties

Computed properties reactively calculate their values based on signals and other computed properties. For example:

- `paginatedTableDataComputed` depends on `sortedTableDataSignal`, `startIndexComputed`, and `endIndexComputed`.
- Changes to any of these dependencies automatically update `paginatedTableDataComputed`.

| Property                     | Type                             | Description                                                                                                                                        |
| ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `startIndexComputed`         | `computed<number>`               | The 1-based index of the first item on the current page. Depends on `currentPageSignal` and `itemsPerPageSignal`.                                  |
| `endIndexComputed`           | `computed<number>`               | The 1-based index of the last item on the current page. Depends on `startIndexComputed` and `sortedTableDataSignal`.                               |
| `paginatedTableDataComputed` | `computed<IAbstractTableData[]>` | Combines sorting and pagination on the filtered and sorted data. Depends on `sortedTableDataSignal`, `startIndexComputed`, and `endIndexComputed`. |

> **Note**: Signals (`currentPageSignal`, `itemsPerPageSignal`, `sortedTableDataSignal`) are Angular reactive properties that trigger re-computation of dependent computed properties like `paginatedTableDataComputed` whenever they are updated.

## Focus Behaviour

After a different page is committed and its rows have rendered, the component moves focus to the first element marked
with the `#paginationFocusTarget` template reference. Normal browser focus behaviour also scrolls that element into view.

The marker is optional and does not add an element to the rendered DOM. It can therefore be added to an existing element,
such as the first cell rendered for each page, without changing the table structure:

```html
<td #paginationFocusTarget opal-lib-moj-sortable-table-row-data>{{ row['name'] }}</td>
```

If the marked element is not already programmatically focusable, the component temporarily adds `tabindex="-1"` and
removes it when the element loses focus. If no `#paginationFocusTarget` is supplied, the component falls back to focusing
the `#main-content` landmark and scrolling to the top of the page through `UtilsService.focusAndScrollToTop()`.

The base class exposes `pageChangeAnnouncement`, which the consuming template should render in a visually hidden status
region as shown in the usage example. After `onPageChange()` commits a different page, it contains
"{page title}, page X of Y" when `paginationPageTitle` is supplied, or "Page X of Y" otherwise. Its initial value is empty,
so it does not announce the initial page when the component first renders. The total page count is derived from
`sortedTableDataSignal()`, ensuring it describes the filtered and sorted rows currently being paginated rather than the
unfiltered source data. The pagination control itself is not responsible for this announcement.

## Methods

`AbstractSortableTablePaginationComponent` introduces additional methods for managing pagination while retaining sorting logic.

### Common Methods:

- **`onPageChange(newPage: number)`**: Updates the announcement and current page, waits for the new rows to render, and
  then applies the focus behaviour described above. Selecting the current page again does not announce or move focus.
- **`onSortChange(event: { key: string; sortType: 'ascending' | 'descending' })`**:
  Updates the sort state for the table and resets the pagination to the first page. This ensures that the user always starts from the beginning of the dataset when a new sorting order is applied.

The component also keeps the current page within range when the page size changes, so consumers can update `itemsPerPageSignal` without leaving the table on an empty page.

### Examples

- **Change Page**:
  ```typescript
  component.onPageChange(2); // Switches to page 2
  ```
- **Sort Table**:
  ```typescript
  component.onSortChange({ key: 'name', sortType: 'ascending' });
  // Sorts the table by the 'name' column in ascending order and resets to page 1.
  ```

## Interfaces

`AbstractSortableTablePaginationComponent` uses interfaces to represent table data and sorting state.

### Key Interfaces:

1. **Table Data Interface**:

   - `IAbstractTableData`: Represents a row of table data.

2. **Sort State Interface**:
   - `IAbstractSortState`: Tracks the sorting state of each column.

## Mocks

Several mock files are included to simulate table data, sorting behaviours, and pagination scenarios for testing purposes.

### Mock Files:

1. **abstract-sortable-table-data.mock.ts**: Simulates table data scenarios.
2. **abstract-sortable-table-sort-state.mock.ts**: Provides mock sort states for testing.

These mocks can be used in unit tests to validate table sorting and pagination behaviour.

## Testing

Unit tests for this component can be found in the `abstract-sortable-table-pagination.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

### Testing Scenarios

Use the mock files provided to test various scenarios, such as:

- Sorting data by different columns and verifying the updated order.
- Changing the current page and validating that the correct data subset is displayed.
- Adjusting the number of items per page and ensuring the table updates accordingly.
- **Dynamic Data Updates**: Verify that `paginatedTableDataComputed` updates correctly when `sortedTableDataSignal` changes dynamically (e.g., after an API call).

### Additional Testing Scenarios

- **Empty Datasets**: Ensure the component gracefully handles cases where the dataset is empty and displays a "No data available" message.
- **Large Datasets**: Test performance and correctness with datasets containing thousands of rows.
- **Custom Sorting Keys**: Validate that sorting logic works with non-numeric or complex keys, such as dates or nested object properties.

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with sorting and pagination logic.

### Prerequisites

This component is compatible with Angular 16 and above, as it uses Angular Signals and standalone components.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractSortableTablePaginationComponent` in your Angular application. It also includes references to interfaces and mocks that support table sorting, pagination, and testing.
