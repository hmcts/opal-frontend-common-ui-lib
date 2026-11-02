# Custom outbound file viewer

`CustomOutboundFileViewerComponent` renders the outbound page using the common presentational viewer, filters and table. The consuming application supplies prepared rows, chooses whether to fetch initially or only after Refresh, and handles requests.

```ts
import { CustomOutboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer';
import type { ICustomFileInterfaceViewerOutboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer/interfaces';
```

```html
<ng-template #fileAction let-row>
  <button type="button" (click)="onFileAction(row)">Retrieve {{ row.Title }}</button>
</ng-template>
<opal-lib-custom-outbound-file-viewer
  [businessUnits]="businessUnits"
  [tableData]="tableData()"
  [actionTemplate]="fileAction"
  (formSubmit)="onFormSubmit($event)"
></opal-lib-custom-outbound-file-viewer>
```

`businessUnits` is required and excludes the synthetic All choice. `tableData` defaults to null, hiding results until supplied; an empty array shows the outbound empty message. `actionTemplate` is optional and receives the current prepared row as `$implicit`. Without it, action cells remain empty. The consumer decides which actions are available and owns URLs, downloads, errors and focus.

`formSubmit` emits `IAbstractFormBaseForm<unknown>` with `formData` and `nestedFlow: false`. Only business-unit and date filters are visible; source and type controls remain at their defaults and should be ignored by the outbound mapper. Refresh always remains enabled so valid unchanged filters can be resubmitted.

Rows contain `'File ID'`, numeric `'Date and time'`, `dateTimeDisplay`, `Title`, `'Business unit'`, `Target`, `Status`
and `Actions`. The application maps target codes and other API fields to display values. The table sorts newest first,
supports sorting every displayed column including the final Action column and shows 25 rows per page. The consumer
supplies `Actions` as the sort label (for example, `Download` or an empty string for no action); `actionTemplate`
supplies the visible cell. The library does not infer download eligibility. It has no Type/Source columns. Its IDs are
`outbound-interface-files-results` and `outbound-file-viewer-pagination`.

## Component behavior

The wrapper declares no methods or lifecycle hooks. It inherits presentational inputs and `formSubmit` from
`CustomFileInterfaceViewerBase`, selects outbound mode and forwards those bindings to the shared viewer.
The [filter component](../common/custom-file-interface-viewer-filters/readme.md#methods) owns validation and
submission; the [common table](../common/custom-file-interface-viewer-table-wrapper/readme.md#methods) inherits sorting
and pagination. Replacing business-unit options clears a removed selection to `null` while preserving valid
selections, All and interaction state.

## Testing

The wrapper's component, template and spec are colocated. It inherits common inputs/outputs from the shared base and forwards them to the common viewer. The shared table owns sorting and pagination; domain-specific query, permission and download logic remains in the application. Specs cover visible filters, repeated Refresh, pending/empty results, target/date sorting, pagination and consumer-owned row actions without HTTP providers.

```sh
corepack yarn test --include='**/custom-file-interface-viewer/**/*.spec.ts'
corepack yarn build
corepack yarn exports:check
corepack yarn pack:check
```
