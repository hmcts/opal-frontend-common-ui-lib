# AbstractSelectableTableComponent

## Overview

The `AbstractSelectableTableComponent` provides multi-select behavior for tables that support sorting and pagination. It enables users to select individual rows or select all rows across all filtered data, enhancing the functionality of standard tables with convenient selection features.

## Key Features

- Multi-row selection with support for selecting individual rows.
- Select-all functionality that applies across all filtered rows, not just the current page.
- Automatic pruning of the selection when the underlying data changes, ensuring consistency.
- Emits a `selectionChanged` event whenever the selection state updates.

## Inputs / Outputs

- `existingSelection` (Input): An array of IDs representing rows that should be initially selected.
- `selectionChanged` (Output): An event emitter that emits the array of currently selected row IDs whenever the selection changes.

## Public API Methods

- `rowIsSelected(row: T): boolean`  
  Returns whether the given row is currently selected.

- `toggleRow(row: T): void`  
  Toggles the selection state of the specified row.

- `toggleSelectAll(): void`  
  Toggles selection of all rows across all filtered data.

- `clearSelection(): void`  
  Clears all selections.

- `onApplyFilters(): void`  
  Should be called when filters are applied to update and prune the selection accordingly.

## Extending

To use `AbstractSelectableTableComponent`, extend it and implement the abstract method `getRowId(row: T): string` which returns a unique identifier for a given row. This ID is used internally to manage selections.

### Example

```typescript
import { AbstractSelectableTableComponent } from 'path-to-abstract-selectable-table';

interface MyRow {
  id: string;
  name: string;
  // other properties...
}

export class MySelectableTableComponent extends AbstractSelectableTableComponent<MyRow> {
  getRowId(row: MyRow): string {
    return row.id;
  }

  // Additional component logic here...
}
```

This approach allows you to integrate multi-select capabilities seamlessly into your sortable and paginated tables.
