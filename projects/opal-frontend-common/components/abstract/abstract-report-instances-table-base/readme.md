# Abstract Report Instances Table Base Component

This Angular component serves as a small foundational base class for report instances tables. It extends
`AbstractSortableTablePaginationComponent` and provides report-table data input wiring and typed paginated data.

It does not provide shared table markup, columns, links, actions, status display, or report-specific row mapping.
Consuming applications remain responsible for the concrete table template and report action behaviour.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
- [Inputs](#inputs)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Ownership Model](#ownership-model)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractReportInstancesTableBaseComponent` in your project, extend it in a concrete report table component:

```typescript
import { AbstractReportInstancesTableBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-instances-table-base';
```

## Usage

This component is designed to be extended by report table components that need the existing sortable-table pagination
behaviour with a report-specific `tableData` input.

If a consuming application needs a page size other than the inherited default, set `itemsPerPageSignal` in the
concrete component constructor.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { AbstractReportInstancesTableBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-instances-table-base';

interface ReportRow extends IAbstractTableData<SortableValuesType> {
  Title: string;
  instanceId: string;
}

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
})
export class ReportTableComponent extends AbstractReportInstancesTableBaseComponent<ReportRow> {}
```

### Example Template Usage:

```html
<app-report-table [tableData]="rows"></app-report-table>
```

## Properties

The component provides typed report table pagination properties:

| Property                    | Type                    | Description                                         |
| --------------------------- | ----------------------- | --------------------------------------------------- |
| `itemsPerPageSignal`        | `WritableSignal<number>` | Page size used by inherited pagination. Defaults to `10`. |
| `paginatedTableDataComputed` | `Signal<TTableData[]>`   | Current page of sorted report table data.          |

## Inputs

| Input       | Type           | Description                                                               |
| ----------- | -------------- | ------------------------------------------------------------------------- |
| `tableData` | `TTableData[]` | Required report rows. Updates inherited table state and reapplies filters. |

## Methods

This class relies on inherited sorting and pagination methods from `AbstractSortableTablePaginationComponent`.
Consumers should use the inherited API for sorting, filtering, and page changes.

## Interfaces

The generic row type must satisfy the inherited sortable table data contract:

1. **Table Data Contracts**:
   - `TTableData extends IAbstractTableData<SortableValuesType>`: concrete report row shape
   - `IAbstractTableData<SortableValuesType>`: base sortable table row contract
   - `SortableValuesType`: supported values for sortable table cells

## Ownership Model

**Shared by this base class:**

- Required report table data input
- Forwarding table data into inherited sortable table state
- Reapplying inherited filters when table data changes
- Typed paginated table data

**Owned by the consuming application:**

- Concrete table template
- Column labels and sort keys
- Row links and action behaviour
- Status/action display
- Report-specific row mapping
- Page size policy

## Testing

Unit tests should cover:

- Setting report table data through the `tableData` input
- Default inherited page size behaviour
- Consumer-defined page size behaviour through `itemsPerPageSignal`
- Paginated data returned for subsequent pages
- Consumer row typing through the generic `TTableData`

## Contributing

Keep this base limited to wiring that is stable across report instances tables. Do not add shared report table markup,
column definitions, routing, download actions, or journey-specific behaviour unless the report table experience has been
standardised across consuming applications.
