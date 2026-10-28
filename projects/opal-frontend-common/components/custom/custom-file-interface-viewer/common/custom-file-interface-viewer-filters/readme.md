# Custom File Interface Viewer Filters Component

This standalone Angular component collects and validates interface-file search filters. It combines business-unit and date filters with additional file-type and source filters for inbound files. A valid submission emits the raw form values for the consuming page to turn into an API query.

Date controls are rendered by the shared [Custom Date Filter](../../../custom-date-filter/README.md). The file-viewer filter owns the complete form, date validation, error summary and Refresh action; the shared component uses the same controls alongside the business-unit, type and source filters.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Form values and defaults](#form-values-and-defaults)
- [Date validation](#date-validation)
- [Refresh behaviour](#refresh-behaviour)
- [Methods](#methods)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the component into the `imports` array of a standalone component:

```typescript
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
```

The component uses Angular Reactive Forms internally. The consuming application must provide its normal Angular router configuration because the inherited `AbstractFormBaseComponent` uses `Router` and `ActivatedRoute`.

## Usage

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';

@Component({
  selector: 'app-interface-file-filters-example',
  imports: [CustomFileInterfaceViewerFiltersComponent],
  template: `
    <opal-lib-custom-file-interface-viewer-filters
      [isInbound]="true"
      [businessUnits]="businessUnits"
      [source]="sources"
      [sourceList]="fileTypes"
      (formSubmit)="onFormSubmit($event)"
    ></opal-lib-custom-file-interface-viewer-filters>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceFileFiltersExampleComponent {
  public readonly businessUnits: IAlphagovAccessibleAutocompleteItem[] = [
    { name: 'Example business unit', value: '0046' },
  ];
  public readonly sources: IAlphagovAccessibleAutocompleteItem[] = [{ name: 'Allpay', value: 'ALLPAY' }];
  public readonly fileTypes: IAlphagovAccessibleAutocompleteItem[] = [
    { name: 'RAW', value: 'SOURCE' },
    { name: 'TRANSFORMED', value: 'TRANSFORMED_JSON' },
  ];
  public appliedFilters: IAbstractFormBaseForm<unknown> | null = null;

  /**
   * Retains the validated values for the page's query-building workflow.
   * @param form - Raw filter values and submission metadata.
   */
  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    this.appliedFilters = form;
  }
}
```

Supply canonical choices without any synthetic All entries. The component prepends these choices for display:

| Filter        | Prepended option   | Value |
| ------------- | ------------------ | ----- |
| Business unit | All business units | `''`  |
| Type          | All types          | `''`  |
| Source        | All sources        | `''`  |

The component retains the supplied arrays without adding entries to them. Dropdowns start empty: an All option is available but is not initially selected. Selecting an All option writes `''` to the matching control; the initial unselected value is `null`.

For outbound use, bind `[isInbound]="false"` and still supply all required inputs. `source` and `sourceList` can be empty arrays when those filters are hidden. Business-unit and date filters remain visible.

The consuming page owns permission-based business-unit selection, API parameters, date-to-timestamp conversion, request execution and results. Initialise the page's first request separately when results must load on entry: this filter does not emit `formSubmit` during initialisation.

## Inputs

`isInbound` and `businessUnits` are required; source and type choices are optional so outbound consumers can omit them.

| Input           | Type                                    | Default | Description                                                                                                                               |
| --------------- | --------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `isInbound`     | `boolean`                               | `false` | Shows the type and source dropdowns when `true`. Business-unit and date filters are always shown.                                         |
| `businessUnits` | `IAlphagovAccessibleAutocompleteItem[]` | `[]`    | Permitted business-unit choices for **Filter by business unit**. Use display names and API codes; preserve leading zeros in string codes. |
| `source`        | `IAlphagovAccessibleAutocompleteItem[]` | `[]`    | Originating-interface choices for **Filter by source**, such as Allpay.                                                                   |
| `sourceList`    | `IAlphagovAccessibleAutocompleteItem[]` | `[]`    | File-type choices for **Filter by type**, such as RAW and TRANSFORMED. Despite its name, this input supplies types.                       |

Replacing `businessUnits`, `source` or `sourceList` clears a removed selection to `null`. Valid choices,
the explicit All value `''` and an already empty `null` remain unchanged, as do dirty/pristine and touched/untouched
state. For example, replacing business-unit options containing the selected `0046` with only `0042` clears the
control, so the next Refresh cannot submit the hidden code. Supply a new array when updating choices.

Each option has a `name: string` and `value: string | number`. Supply string API values to match the filter form's string-valued controls. Domain restrictions belong to the consuming page's query; the filter has no `domain` input.

## Outputs

| Output       | Type                             | Description                                                                                                                                                                                 |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formSubmit` | `IAbstractFormBaseForm<unknown>` | Inherited output emitted once after a valid submit. `formData` contains the raw seven-field form value; `nestedFlow` is always `false` for this component. Invalid submissions do not emit. |

A default-value submission has this shape:

```typescript
const submission: IAbstractFormBaseForm<unknown> = {
  formData: {
    businessUnit: null,
    dateFilter: 'last7Days',
    days: '',
    dateFrom: '',
    dateTo: '',
    fileType: null,
    source: null,
  },
  nestedFlow: false,
};
```

`formData` is not an API request. For example, `fileType` remains a single selected string, and dates remain `DD/MM/YYYY` strings. The page decides which empty values to omit, which invariant filters to add and how to represent dates and types for its service.

## Form values and defaults

The component exposes its typed reactive form as `filtersForm` and through the inherited `form` property.

| Field          | Control value type                                   | Initial value | Meaning                                                                |
| -------------- | ---------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `businessUnit` | `string \| null`                                     | `null`        | Selected business-unit code, or `''` for All business units.           |
| `dateFilter`   | `'last7Days' \| 'customDays' \| 'dateRange' \| null` | `'last7Days'` | Selected date mode. Last 7 days is the only initially selected filter. |
| `days`         | `string \| null`                                     | `''`          | Number of days as entered when Custom days is selected.                |
| `dateFrom`     | `string \| null`                                     | `''`          | Optional start date in `DD/MM/YYYY` for Date range.                    |
| `dateTo`       | `string \| null`                                     | `''`          | Optional end date in `DD/MM/YYYY` for Date range.                      |
| `fileType`     | `string \| null`                                     | `null`        | Selected file-type value, or `''` for All types.                       |
| `source`       | `string \| null`                                     | `null`        | Selected source value, or `''` for All sources.                        |

The shared date component clears inactive fields when the date mode changes; this parent updates their validators. Inactive values are also cleared during parent initialisation:

- **Last 7 days**, or a programmatic `null` date mode, clears `days`, `dateFrom` and `dateTo`.
- **Custom days** clears `dateFrom` and `dateTo`.
- **Date range** clears `days`.

The component does not calculate a Last 7 days or Custom days timestamp range. The consuming page performs that calculation.

## Date validation

### Last 7 days

No additional date entry is needed. The default form is valid and can be submitted using Refresh immediately.

### Custom days

Days is required and must contain digits only, with a numeric value greater than zero. Negative numbers, decimals and non-numeric text are invalid. The field's visual width does not impose a maximum number or character count.

| Condition         | Message                        |
| ----------------- | ------------------------------ |
| Empty             | Enter the number of days       |
| Non-digit content | Days must be a number          |
| Numeric zero      | Days must be greater than zero |

### Date range

Date from and Date to use the shared MOJ date-picker component, with the hint `For example, 31/01/2023`. Changes from each picker update the corresponding form control.

At least one boundary must be entered. Each supplied value must be a real calendar date in `DD/MM/YYYY` format and must not be in the future. A single valid boundary is allowed. When both are supplied, Date from must be on or before Date to; equal dates are valid.

| Condition               | Message                                           |
| ----------------------- | ------------------------------------------------- |
| Both boundaries empty   | You must enter at least 1 of date from or date to |
| Date from after Date to | The Date from cannot be after the Date to         |
| Invalid format          | Date from/to must be in the format DD/MM/YYYY     |
| Invalid calendar date   | Date from/to must be a real date                  |
| Future date             | Date from/to must be in the past                  |

The `from/to` entries above represent the matching field name, not a combined message. Missing-boundary and reversed-range errors are attached to Date from and included in the summary. Domain-specific minimum or switchover dates are not enforced by this component.

All validation messages and priorities are defined in `CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FIELD_ERRORS`, using the standard `IAbstractFormBaseFieldErrors` structure.

Date from priorities run from 1 to 5 in this order: required, format, real date, future date and range. Date to uses priorities 1 to 3 for format, real date and future date.

Missing boundaries set the `required` error on `dateFrom`; reversed ranges set `dateFromAfterDateTo` on that control. Both make the form invalid and are collected by inherited `handleErrorMessages()` alongside the existing field validators. Correcting the range removes the previous cross-field error on the next submit.

The local [filter utilities](./utils/custom-file-interface-viewer-filters.utils.ts) apply the existing required, pattern, non-zero, optional-date and future-date validators. Range ordering uses `DateService.calculateDaysBetweenDates`; there is no separate date parser or new validator entry point. The component only coordinates validation, form-base messages, focus and submission.

## Refresh behaviour

Refresh stays enabled for the initial pristine form and after each submission. Users can refresh the latest list or retry a failed request with unchanged criteria. Submitting prevents the native form action and validates the active fields and any date-range relationship.

A valid submit emits `formSubmit` and marks the form pristine immediately. The consuming page handles each submission, including repeated criteria. Keep the previous table rows on failure; replace them only after a successful response. The filter itself does not execute or observe HTTP requests.

An invalid submit preserves the edited state, shows validation messages and moves focus to the error summary after it renders.

Programmatic control updates do not automatically mark Angular forms dirty. Refresh remains enabled regardless of the form's dirty state.

## Methods

Normal consumers bind `formSubmit` and allow the template to handle these methods.

| Method or accessor | Responsibility |
| ------------------ | -------------- |
| `businessUnits`, `source`, `sourceList` setters | Replace the supplied option arrays and clear selections absent from the updated choices. |
| `businessUnits`, `source`, `sourceList` getters | Return the supplied choices without the synthetic All option. |
| `clearUnavailableSelection(control, options)` | Clears a removed non-empty selection to `null` without changing interaction state. Private implementation detail. |
| `setupDateFilterValidation()` | Clears initially inactive fields, applies active validators and subscribes to mode changes until destruction. Private implementation detail. |
| `focusFilterErrorSummary()` | Focuses the summary after validation messages have rendered. Private implementation detail. |
| `handleFormSubmit(event: SubmitEvent)` | Prevents native submission, validates active fields and range ordering, then emits valid values and marks the form pristine; invalid forms receive summary focus. |
| `ngOnInit()` | Configures date validation before starting the inherited form behavior. |

Date-picker events are handled by the shared component and update the parent-owned `dateFrom` and `dateTo` controls directly.
The parent passes form-base validation messages through `dateFilterErrors`, keyed by the shared component's generated field IDs.
The inherited summary keeps standard form-control names; its click binding translates them to rendered field IDs for focus. Consumers do not need to pass a separate date form or handle date events.

## Accessibility

The form uses GOV.UK labels, a date radio fieldset and conditional input sections, together with accessible autocompletes and MOJ date pickers. Dropdown labels are **Filter by business unit**, **Filter by type** and **Filter by source**. Native inputs remain in normal keyboard order without additional focusable autocomplete hosts.

Custom days uses a numeric input mode and associates its displayed error with the input through `aria-describedby`. The summary receives focus after an invalid submit; selecting a summary link uses the inherited field-navigation handler to scroll to and focus the relevant control. Refresh has the accessible label **Apply filters and refresh**.

The template uses fixed field IDs. Render one instance per page to avoid duplicate IDs.

## Testing

The colocated `custom-file-interface-viewer-filters.component.spec.ts` and utility spec cover initial values, option
composition and updates, removed/retained selections and interaction state, inbound/outbound visibility, always-enabled
Refresh, date validation and clearing, shared date-component composition, date-picker events, summary-link focus and
subscription cleanup.

Run its tests from the library repository root:

```bash
yarn test \
  --include='**/custom-file-interface-viewer-filters/**/*.spec.ts'
```

For coverage of the component and its utilities:

```bash
yarn test:coverage \
  --include='**/custom-file-interface-viewer-filters/**/*.spec.ts' \
  --coverage-include='projects/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters/**/*.ts'
```

## Contributing

Keep this component responsible for form values, validation and submission only. Keep permission-based option selection, API scope, date-range calculation and requests in the consuming frontend. Reuse shared date definitions and update the examples and colocated spec when the public form contract changes.
