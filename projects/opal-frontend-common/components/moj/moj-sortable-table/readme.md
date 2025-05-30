---

# MOJ Sortable Table Component

This Angular component provides a Ministry of Justice (MOJ)-styled Sortable table.

## Table of Contents

- [Usage](#usage)
- [Inputs](#inputs)
- [Testing](#testing)
- [Contributing](#contributing)

## Usage

First you have to create a new component called wrapper for your sortable table component It should be something like this.This should be seperate from your parent component.


```typescript
    import { CommonModule } from '@angular/common';
    import { Component, Input, OnInit } from '@angular/core';
    import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
    import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
    import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
    import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
    import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';
    import { ITableComponentTableData, ISortState } from './Interfaces/table-wrap-interfaces';

    @Component({
      selector: 'opal-lib-table-wrap',
      imports: [
        CommonModule,
        MojSortableTableComponent,
        MojSortableTableHeaderComponent,
        MojSortableTableRowComponent,
        MojSortableTableRowDataComponent,
      ],
      templateUrl: './table-wrap.component.html',
    })
    export class TableWrapComponent extends AbstractSortableTableComponent implements OnInit {
      @Input({ required: true }) set tableData(tableData: ITableComponentTableData[]) {
        this.abstractTableData = tableData;
      }

      @Input({ required: true }) set existingSortState(existingSortState: ISortState | null) {
        this.abstractExistingSortState = existingSortState;
      }
    }

```
Then In the wrapper HTML element,  you have to create the sortable table columns and rows like this.

```html

<opal-lib-moj-sortable-table>
  <ng-container head>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="imposition"
      [sortDirection]="sortState['imposition']"
      (sortChange)="onSortChange($event)"
    >
      Imposition
    </th>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="creditor"
      [sortDirection]="sortState['creditor']"
      (sortChange)="onSortChange($event)"
    >
      Creditor
    </th>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="amountImposed"
      [sortDirection]="sortState['amountImposed']"
      (sortChange)="onSortChange($event)"
    >
      Amount imposed
    </th>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="amountPaid"
      [sortDirection]="sortState['amountPaid']"
      (sortChange)="onSortChange($event)"
    >
      Amount paid
    </th>
    <th
      opal-lib-moj-sortable-table-header
      columnKey="balanceRemaining"
      [sortDirection]="sortState['balanceRemaining']"
      (sortChange)="onSortChange($event)"
    >
      Balance remaining
    </th>
  </ng-container>
  <ng-container row>
    @for (row of abstractTableData; track row) {
      <tr opal-lib-moj-sortable-table-row>
        <td opal-lib-moj-sortable-table-row-data id="imposition">{{ row['imposition'] }}</td>
        <td opal-lib-moj-sortable-table-row-data id="creditor">
          {{
            row['creditor'] === 'major'
              ? 'Major Creditor'
              : row['creditor'] === 'minor'
                ? 'Minor Creditor'
                : 'Default Creditor'
          }}
        </td>
        <td opal-lib-moj-sortable-table-row-data id="amountImposed">{{ row['amountImposed'] }}</td>
        <td opal-lib-moj-sortable-table-row-data id="amountPaid">{{ row['amountPaid'] }}</td>
        <td opal-lib-moj-sortable-table-row-data id="balanceRemaining">{{ row['balanceRemaining'] }}</td>
      </tr>
    }
  </ng-container>
</opal-lib-moj-sortable-table>


```

These are some of the interfaces you will need to create for your component.
```typescript
    import { IAbstractSortState } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
  import { IAbstractTableData } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
  import { SortableValues } from '@services/sort-service/types/sort-service-type';

  export interface ITableComponentTableData extends IAbstractTableData<SortableValues> {
    imposition: string;
    creditor: string;
    amountImposed: number;
    amountPaid: number;
    balanceRemaining: number;
  }

  export interface ISortState extends IAbstractSortState {
    imposition: 'ascending' | 'descending' | 'none';
    creditor: 'ascending' | 'descending' | 'none';
    amountImposed: 'ascending' | 'descending' | 'none';
    amountPaid: 'ascending' | 'descending' | 'none';
    balanceRemaining: 'ascending' | 'descending' | 'none';
  }

```

In your parent component you need to have the data you will be passing in. Such as


```typescript
    import { TableWrapComponent } from './table-wrap/table-wrap.component';
    import { ISortState } from './table-wrap/Interfaces/table-wrap-interfaces';
    import { ITableComponentTableData } from './table-wrap/Interfaces/table-wrap-interfaces';
    .......
    Component config
    .......

    tableData: ITableComponentTableData[] = [
        {
        imposition: 'Imposition 1',
        creditor: 'major',
        amountImposed: 1000,
        amountPaid: 200,
        balanceRemaining: 800,
        },
        {
        imposition: 'Imposition 2',
        creditor: 'minor',
        amountImposed: 1500,
        amountPaid: 500,
        balanceRemaining: 1000,
        },
        {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
        },
    ];

    public existingState: ISortState = {
        imposition: 'ascending',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'none',
    };

    public handleEmit($event: any): void {
        console.log('Emit', $event);
    }
    }

```

Then you need to forge them all together with the table wrapping component in the parent html.

```html
    <opal-lib-table-wrap
    [tableData]="tableData"
    [existingSortState]="existingState"
    (abstractSortState)="handleEmit($event)"
    ></opal-lib-table-wrap>

```





## Inputs

| Input             | Type    | Description                                                    |
| ----------------- | ------- | -------------------------------------------------------------- |
| `tableData` | `obj` | Object of key:value pairs representing a table. |
| `existingSortState` | `obj` | Object of key:value pairs representing a state of sorting. |




## Testing

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
