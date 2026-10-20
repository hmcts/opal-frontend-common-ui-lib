# Custom date filter

`CustomDateFilterComponent` renders the existing GOV.UK date radios and MoJ date pickers: Last 7 days, Custom days, and Date range. It has no reporting, routing, API, store, or submit-button dependencies.

Import it from `@hmcts/opal-frontend-common/components/custom/custom-date-filter` and add it to the consuming standalone component's `imports`.

Pass four parent-owned reactive form controls (`dateFilter`, `days`, `dateFrom`, and `dateTo`). The controls can be part of a larger form alongside business unit, status, or other filters:

```html
<form [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
  <!-- Other filter controls can appear before or after the date filter. -->
  <opal-lib-custom-date-filter
    idPrefix="account-search"
    [controls]="filtersForm.controls"
    [errors]="fieldErrors()"
  ></opal-lib-custom-date-filter>
  <button type="submit" class="govuk-button">Apply filters</button>
</form>
```

Import `ICustomDateFilterControls` from the `/interfaces` entry point and `CustomDateFilterOption` from `/types` to type the controls. Values are `last7Days`, `customDays`, or `dateRange`; date picker values use `DD/MM/YYYY`. Each control may also contain `null`.

Supply a unique `idPrefix` per instance. Error maps use generated field IDs: `<prefix>-days`, `<prefix>-date-from`, and `<prefix>-date-to`. Use the same IDs in the parent's error summary. Optional inputs are `legendText`, `legendClasses`, and `dateHintText`.

The component clears inactive conditional fields when the date option changes, updates the existing controls directly, and disposes its subscription when destroyed or given replacement controls. Initial values are preserved. Use normal emitting form updates when restoring/resetting controls after rendering so conditional content updates too.

The parent owns validation, error-summary focus, submission, and query building. Existing reporting consumers can retain `AbstractReportSummaryListBaseComponent` validation and query logic; other consumers can supply their own validators and combine the date values with other filter criteria. `clearInactiveCustomDateFilterFields` is exported from the `/utils` entry point for consumers that need the same clearing behaviour outside the component.

## File layout

Keep the component, template, and component spec at the component root. Supporting files use dedicated folders:

- `constants/`: date option values and input defaults (`*.constant.ts`).
- `interfaces/`: parent-owned control contracts (`*.interface.ts`).
- `types/`: the date option union (`*.type.ts`).
- `utils/`: conditional-field logic and its adjacent `*.utils.spec.ts` unit tests.

Each folder has a secondary package entry point under `@hmcts/opal-frontend-common/components/custom/custom-date-filter/<folder>`. Imports within each entry point point directly to their files; imports across entry points use the corresponding package subpath.
