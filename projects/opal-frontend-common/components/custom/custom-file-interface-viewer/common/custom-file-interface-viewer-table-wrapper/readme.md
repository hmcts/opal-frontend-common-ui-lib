# Shared interface-file table

`CustomFileInterfaceViewerTableWrapperComponent` renders inbound and outbound prepared rows using the existing
sortable-table and pagination abstractions. Its component, template and spec are colocated in this directory;
the shared `../constants/` owns the default sort state; local `constants/` owns the page size, and `interfaces/` owns the
action-template context.

Inputs are `tableData`, `existingSortState`, `isInbound` and an optional `actionTemplate`. Inbound columns are Date and
time, Title, Type, Business unit, Source, Status and Action. Outbound columns replace Type/Source with Target.
Action is the final, sortable column in both directions and sorts by the supplied `Actions` label; the cell itself
is rendered exclusively by `actionTemplate`. Supply an empty string for an unavailable action when blank cells should
move between the start and end as direction changes. Nullable labels retain the shared sort service's null handling.
The table paginates 25 rows and resets pagination when a new result array is supplied.

A partial `existingSortState`, such as `{ Title: 'ascending' }`, leaves omitted sortable columns at `none`
so every heading can still toggle in both directions. Supplied entries are retained without changing the caller's
object. Passing `null` starts every sortable column at `none` and preserves input order until a heading is selected,
even when the table starts empty and rows arrive later.

Import the table from the shared viewer `/common/custom-file-interface-viewer-table-wrapper` entrypoint.
The inbound `/custom-inbound-file-viewer/common/custom-file-interface-viewer-inbound-table-wrapper` entrypoint
exports `CustomFileInterfaceViewerInboundTableWrapperComponent` as an alias, and the table retains the original inbound
selector. Its direction defaults to inbound for that compatibility selector; the shared viewer binds the direction
explicitly.

## Methods

| Method or accessor | Responsibility |
| ------------------ | -------------- |
| `existingSortState` setter | Initializes all sortable keys to `none`, then applies supplied entries; `null` leaves every column unsorted. |
| `onSortChange(event)` | Inherited handler that applies the selected column/direction and resets the page. |
| `onPageChange(page)` | Inherited handler that updates the current page and focuses the first rendered row. |
| `tableData` setter | Inherited input that replaces the prepared rows, reapplies sorting and resets pagination. |

The table adds no request or action-click handler; the supplied template owns each row's action.
Its page-size signal defaults to 25. Numeric `'Date and time'` values drive chronological sorting while
`dateTimeDisplay` supplies the visible text.

## Testing

The colocated spec covers both column sets, chronological sorting, every sortable column including Action,
caller-supplied action labels, sorting rows received after an initially empty result, pagination, new-result resetting
and projected actions. The table does not fetch files or handle downloads itself.
