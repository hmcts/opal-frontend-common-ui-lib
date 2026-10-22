# Shared interface-file table

`CustomFileInterfaceViewerTableWrapperComponent` renders inbound and outbound prepared rows using the existing
sortable-table and pagination abstractions. Its component, template and spec are colocated in this directory;
`constants/` owns its default sort state and page size, and `interfaces/` owns the action-template context.

Inputs are `tableData`, `existingSortState`, `isInbound` and an optional `actionTemplate`. Inbound columns are Date and
time, Title, Type, Business unit, Source, Status and Action. Outbound columns replace Type/Source with Target.
Action is the final, sortable column in both directions and sorts by the supplied `Actions` label; the cell itself
is rendered exclusively by `actionTemplate`. Supply an empty string for an unavailable action when blank cells should
move between the start and end as direction changes. Nullable labels retain the shared sort service's null handling.
The table paginates 25 rows and resets pagination when a new result array is supplied.

The shared viewer entrypoint exports this component. The inbound entrypoint also retains the legacy
`CustomFileInterfaceViewerInboundTableWrapperComponent` export as an alias, and the table retains the original inbound
selector. Its direction defaults to inbound for that compatibility selector; the shared viewer binds the direction
explicitly.

## Methods

| Method or accessor | Responsibility |
| ------------------ | -------------- |
| `existingSortState` setter | Passes the supplied configuration, including `null`, to the inherited sort-state input. |
| `onSortChange(event)` | Inherited handler that applies the selected column/direction and resets the page. |
| `onPageChange(page)` | Inherited handler that updates the current page and focuses the first rendered row. |
| `tableData` setter | Inherited input that replaces the prepared rows, reapplies sorting and resets pagination. |

The table adds no request or action-click handler; the supplied template owns each row's action.
Its page-size signal defaults to 25. Numeric `'Date and time'` values drive chronological sorting while
`dateTimeDisplay` supplies the visible text.

## Testing

The colocated spec covers both column sets, chronological sorting, every sortable column including Action,
caller-supplied action labels, pagination, new-result resetting and projected actions. The table does not fetch files or
handle downloads itself.
