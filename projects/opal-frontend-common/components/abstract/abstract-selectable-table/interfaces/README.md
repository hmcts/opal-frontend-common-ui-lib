# IAbstractSelectableTableSelectionPayload Interface

## Overview

The `IAbstractSelectableTableSelectionPayload` interface defines the payload structure emitted when the selection in the abstract selectable table changes. This payload provides both the unique identifiers of the selected rows and the corresponding row data objects.

## Definition

```typescript
interface IAbstractSelectableTableSelectionPayload<RowType> {
  selectedIds: Set<AbstractSelectableTableRowIdType>;
  selectedRows: RowType[];
}
```

## Properties

- `selectedIds`: A `Set` of `AbstractSelectableTableRowIdType` containing the unique IDs of the selected rows.
- `selectedRows`: An array of row objects corresponding to the selected IDs.

## Usage Example

```typescript
function onSelectionChange<RowType>(payload: IAbstractSelectableTableSelectionPayload<RowType>) {
  console.log('Selected IDs:', payload.selectedIds);
  console.log('Selected Rows:', payload.selectedRows);

  // Example: perform an action with the selected rows
  payload.selectedRows.forEach((row) => {
    // handle each selected row
  });
}
```
