# Shared interface-file viewer component

`CustomFileInterfaceViewerComponent` renders the heading, filters, results and optional consumer actions for either direction. Import the component from `@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common`.

Inputs are `isInbound`, required `businessUnits`, optional `source` and `sourceList`, `tableData`, `tableSort` and optional `actionTemplate`. A null result leaves the table unset; an empty array renders the direction-specific empty message. `formSubmit` forwards valid raw filter values, including repeated submissions. The component makes no initial request.

Each row's `'Business unit'` field accepts `string[] | null`; names render as separate GOV.UK list items in their supplied
order. The `[businessUnits]` filter input accepts an array of autocomplete options with `name` and `value` properties.

`isInbound` selects Type/Source columns and their filters or the outbound Target column. All displayed columns are
sortable, including the final Actions column. The shared default sort state includes inbound Type and Source even when
`tableSort` is omitted. The table sorts numeric timestamps, displays caller-supplied date labels and paginates 25 rows.
A new result array resets pagination; action clicks do not replace rows or reset the page.

`actionTemplate` has context `ICustomFileInterfaceViewerActionTemplateContext<TFile>`, whose `$implicit` value is the
current row. The generic defaults to `ICustomFileInterfaceViewerTableData`; direction-specific wrapper contracts retain
their concrete row type. The supplied `Actions` string is the sort value for the Actions column; it does not render an
action. Without a template, action cells remain empty. Consumers own eligibility rules, links, API requests, file
saving, error state and focus management. The library does not inject a file service or require HTTP providers to render
either viewer.

## Component behavior

This component declares no imperative methods or lifecycle hooks. Its template forwards valid filter events through
`formSubmit`, binds the supplied rows and sorting to the common table, and passes `actionTemplate` unchanged.
The [filters](../custom-file-interface-viewer-filters/readme.md#methods) own validation and error-summary focus;
the [table](../custom-file-interface-viewer-table-wrapper/readme.md#methods) inherits sorting and pagination.
Application-specific criteria, downloads and routing remain in the consumer.

The thin inbound and outbound wrappers forward these inputs through a common base directive.

## Public imports

The `/common` entrypoint exports only `CustomFileInterfaceViewerComponent`. Use the dedicated entrypoints for the table
component, base directive and row/action contracts:

```typescript
import { CustomFileInterfaceViewerTableWrapperComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-table-wrapper';
import { CustomFileInterfaceViewerBase } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/directives/custom-file-interface-viewer-base';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import type { ICustomFileInterfaceViewerActionTemplateContext } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-table-wrapper/interfaces';
```

## Testing

Colocated tests cover filter forwarding, actual
form submission, direction-specific rendering, pending/empty results, supplied sorting, inbound Type/Source sorting with
default configuration and caller-owned action clicks.
