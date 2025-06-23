# AbstractTableFilterComponent

The `AbstractTableFilterComponent` is an abstract base class designed for building reactive, filterable table components in Angular. It provides a fully signal-based filtering model using Angular 19's reactivity system, and supports filtering via keyword input and grouped filter tags.

## Features

- Reactive filtering of table data using Angular signals
- Supports both keyword and tag-based filtering
- Exposes computed filtered data for consumption
- Clean override points for matching logic
- Stateless, testable, and reusable foundation for filterable tables

## Usage

Extend this class in your table wrapper component:

```ts
@Component({ ... })
export class MyFilterableTableComponent extends AbstractTableFilterComponent {
  override matchItemWithFilterOption(item: any, categoryName: string, option: IAbstractTableFilterOption): boolean {
    // Optional: customise matching logic per field
    return item?.[categoryName] === option.value;
  }

  override matchItemWithKeyword(item: any, keyword: string): boolean {
    return Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(keyword.toLowerCase())
    );
  }
}
```

Set filter and table data like so:

```ts
this.setTableData(tableData);
this.filterTags.set(filterCategories);
```

## Signals

| Signal                    | Type                                   | Description                                               |
| ------------------------- | -------------------------------------- | --------------------------------------------------------- |
| `displayTableDataSignal`  | Signal<IAbstractTableData[]>           | The full, unfiltered dataset                              |
| `filterTags`              | Signal<IAbstractTableFilterCategory[]> | Grouped tag filters with selection state                  |
| `keyword`                 | Signal<string>                         | Keyword used for text-based filtering                     |
| `abstractSelectedTags`    | Signal<IAbstractTableFilterCategory[]> | Computed from `filterTags`; not used in applied filtering |
| `filteredTableDataSignal` | Signal<IAbstractTableData[]>           | Computed signal of filtered results                       |

## Public Methods

| Method                                                | Description                                     |
| ----------------------------------------------------- | ----------------------------------------------- |
| `onKeywordChange(keyword)`                            | Updates the keyword for filtering               |
| `onCategoryCheckboxChange(category, value, selected)` | Toggles a specific tag option                   |
| `removeTag(category, value)`                          | Deselects a tag based on category and value     |
| `clearAllFilters()`                                   | Clears all tag selections and the keyword input |
| `setTableData(data)`                                  | Sets the full table data to be filtered         |
| `resetFiltersTo(tags, keyword?)`                      | Resets filter tags and optionally the keyword   |

## Protected Methods (Override Points)

| Method                             | Description                                                           |
| ---------------------------------- | --------------------------------------------------------------------- |
| `matchItemWithFilterOption()`      | Allows overriding how tag filters match table data                    |
| `matchItemWithKeyword()`           | Allows overriding how keyword filters apply                           |
| `getSelectedOptionsFromTags(tags)` | Utility method to extract selected tag options from a tag group array |

## Testing

Unit tests should verify:

- Data passed to `displayTableDataSignal` is filtered as expected
- `filterTags` updates trigger recomputation of `filteredTableDataSignal`
- Override methods correctly influence filtering behaviour
- Events like `onKeywordChange()` and `clearAllFilters()` produce expected state
