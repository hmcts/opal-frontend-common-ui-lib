# AbstractSelectableTableRowIdType

## Overview

The `AbstractSelectableTableRowIdType` defines the allowed identifier type for rows in selectable tables. It ensures that row IDs can be consistently typed as either `string` or `number`, providing flexibility for different data sources.

## Definition

```typescript
export type AbstractSelectableTableRowIdType = string | number;
```

## Usage

In the `AbstractSelectableTableComponent`, this type is used to type the IDs of rows, ensuring that the component can handle row identifiers that are either strings or numbers.

## Example

```typescript
// Define an interface for a table row
interface UserRow {
  id: AbstractSelectableTableRowIdType;
  name: string;
  email: string;
}

// Example usage in a component
const selectedRowId: AbstractSelectableTableRowIdType = 123;

const userRow: UserRow = {
  id: selectedRowId,
  name: 'John Doe',
  email: 'john.doe@example.com',
};
```
