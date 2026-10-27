# Interface-file viewer base directive

`CustomFileInterfaceViewerBase<TFile>` shares the inbound/outbound wrappers' presentational contract: required `businessUnits`, prepared `tableData`, optional `actionTemplate`, `formSubmit`, direction and default sort state. The generic action context retains the concrete row type. Inbound adds required source/type choices; both directions inherit the common default sort.

The base declares no methods or lifecycle hooks. It provides shared input/output metadata, an abstract `isInbound`
direction and the default table sort. The shared default contains every column key for either direction, including
inbound Type/Source and the `Actions` sort value, with date/time descending initially. The direction-specific component
templates forward `formSubmit` without
transforming the filter payload.

The base has no HTTP, download, status eligibility, error or DOM dependencies. Application wrappers own those concerns. Both thin templates pass supplied actions unchanged to the shared viewer, where the current row is exposed as `$implicit`.

The colocated harness spec checks inherited binding and event forwarding without HTTP/file-service providers; the concrete wrapper and shared table specs exercise row rendering, consumer actions, sorting and pagination.
