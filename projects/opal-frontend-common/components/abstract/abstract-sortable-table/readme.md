# Abstract Sortable Table Component

This Angular component serves as a foundational base for managing table sorting functionality. It provides reusable logic for handling table data sorting and is designed to be extended by other table components. It inherits from the `AbstractTableFilterComponent` to provide additional filtering capabilities alongside sorting.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Mocks](#mocks)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractSortableTableComponent` in your project, extend it in your custom table components to manage sorting functionality in your Angular application.

```typescript
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/abstract';
```

## Usage

This component is designed to be used as a base class for managing sorting in a reusable and scalable way. It extends `AbstractTableFilterComponent` to combine filtering and sorting logic.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/abstract';

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html',
})
export class SortableTableComponent extends AbstractSortableTableComponent {
  public sortedTableDataSignal = signal([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ]);

  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };
}
```

```html
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
    @for (row of sortedTableDataSignal(); track row.name) {
    <tr opal-lib-moj-sortable-table-row>
      <td opal-lib-moj-sortable-table-row-data id="name">{{ row.name }}</td>
      <td opal-lib-moj-sortable-table-row-data id="defendant">{{ row.age }}</td>
    </tr>
    }
  </ng-container>
</opal-lib-moj-sortable-table>
```

## Inputs

`AbstractSortableTableComponent` provides key inputs to manage table data and sorting states.

| Input                       | Type                           | Description                                                                                                               |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `abstractExistingSortState` | `IAbstractSortState` or `null` | Tracks the initial sort state for the table. If provided, it overrides the default sort state generated by the component. |

### Signals

| Signal                  | Type                           | Description                                                         |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `sortedTableDataSignal` | `signal<IAbstractTableData[]>` | The final filtered and sorted dataset to be displayed in the table. |

> **Note**: `sortedTableDataSignal` is an Angular signal. Changing this signal triggers re-sorting of the table data and updates the component’s rendering. Ensure updates to `sortedTableDataSignal` are handled reactively.

> **Note**: `sortedTableDataSignal` holds the final filtered and sorted dataset that is rendered in the table after applying sorting and filtering logic.

## Outputs

`AbstractSortableTableComponent` provides outputs the sort state.

| Output              | Type                               | Description                                        |
| ------------------- | ---------------------------------- | -------------------------------------------------- |
| `abstractSortState` | `EventEmitter<IAbstractSortState>` | Emits the updated sort state when sorting changes. |

## Methods

`AbstractSortableTableComponent` provides utility methods for managing sorting logic.

### Common Methods:

- **`createSortState(tableData: IAbstractTableData[]): IAbstractSortState`**:
  Generates an initial sort state based on the provided table data. Each column is assigned a default sort state of 'none'.

  - **Parameters**:
    - `tableData`: An array of table data objects.
  - **Returns**: An `IAbstractSortState` object with column keys mapped to their initial sort state.
  - **Example**:
    ```typescript
    const initialSortState = component.createSortState([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
    ```

- **`onSortChange(event: { key: string; sortType: 'ascending' | 'descending' })`**:
  Updates the sorting state and reorders the table data accordingly.

  - **Parameters**:
    - `event.key`: The column to sort by.
    - `event.sortType`: The sorting order ('ascending' or 'descending').
  - **Example**:
    ```typescript
    component.onSortChange({ key: 'name', sortType: 'ascending' });
    ```

- **`ngOnInit()`**:
  Lifecycle hook that initialises the sort state using `abstractExistingSortState` or generates a default one.

### Examples

```typescript
onSortChange({ key: 'name', sortType: 'ascending' });
```

## Interfaces

`AbstractSortableTableComponent` uses several interfaces to define table data and sorting state structures.

### Key Interfaces:

1. **Table Data Interface**:

   - `IAbstractTableData`: Represents a row of table data.

2. **Sort State Interface**:
   - `IAbstractSortState`: Tracks the sorting state of each column.

## Mocks

Several mock files are included to simulate table data and sorting behaviours for testing purposes.

### Mock Files:

1. **abstract-sortable-table-data.mock.ts**: Simulates table data scenarios.
2. **abstract-sortable-table-sort-state.mock.ts**: Provides mock sort states for testing.

These mocks can be used in unit tests to validate table sorting behaviour.

## Testing

Unit tests for this component can be found in the `abstractSortableTable.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

Use the mock files provided to test various scenarios, such as:

- Sorting table data by different columns and verifying the updated order.
- Validating that the correct `abstractSortState` is emitted on sorting changes.
- Handling edge cases, such as an empty dataset or invalid sort keys.

Example:

```typescript
import { AbstractSortableTableDataMock } from '@hmcts/opal-frontend-common/abstract';

it('should sort data by name in ascending order', () => {
  const mockData = AbstractSortableTableDataMock.getMockData();
  component.setTableData(mockData);
  component.onSortChange({ key: 'name', sortType: 'ascending' });

  expect(component.sortedTableDataSignal()).toEqual([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ]);
});
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with sorting logic and table management.

### Prerequisites

This component is compatible with Angular 16 and above, as it uses Angular Signals and standalone components.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractSortableTableComponent` in your Angular application. It also includes references to interfaces and mocks that support table sorting and testing.
