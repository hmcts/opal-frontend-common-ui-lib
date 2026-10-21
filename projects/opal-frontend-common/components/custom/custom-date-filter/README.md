# Custom Date Filter Component

This Angular component provides date filtering using GOV.UK radios and MoJ date pickers. It supports Last 7 days,
Custom days, and Date range options using reactive form controls supplied by the parent component.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the component and configure the parent form controls:

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomDateFilterComponent } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter';
import type { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';
import type { CustomDateFilterOption } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/types';

@Component({
  selector: 'app-account-search',
  imports: [ReactiveFormsModule, CustomDateFilterComponent],
  templateUrl: './account-search.component.html',
})
export class AccountSearchComponent {
  public readonly filtersForm = new FormGroup<ICustomDateFilterControls>({
    dateFilter: new FormControl<CustomDateFilterOption | null>('last7Days'),
    days: new FormControl<string | null>(''),
    dateFrom: new FormControl<string | null>(''),
    dateTo: new FormControl<string | null>(''),
  });

  public readonly fieldErrors: Readonly<Record<string, string>> = {};
}
```

## Usage

You can use the custom date filter component in your template as follows:

```html
<form [formGroup]="filtersForm">
  <opal-lib-custom-date-filter
    idPrefix="account-search"
    [controls]="filtersForm.controls"
    [errors]="fieldErrors"
  ></opal-lib-custom-date-filter>
</form>
```

The controls can be part of a larger form alongside business unit, status, or other filters. The parent component
handles validation, error-summary focus, submission, and query building. Existing reporting consumers can continue
using `AbstractReportSummaryListBaseComponent` for validation and query logic.

The date options use the following values:

| Option      | Value        | Conditional fields    |
| ----------- | ------------ | --------------------- |
| Last 7 days | `last7Days`  | None                  |
| Custom days | `customDays` | Number of days        |
| Date range  | `dateRange`  | Date from and date to |

Initial control values are preserved. When the selected option changes, the component clears inactive conditional
fields to an empty string. Use form updates that emit events when restoring or resetting controls after rendering
so the conditional content updates too.

## Inputs

| Input           | Type                               | Default                       | Description                                                 |
| --------------- | ---------------------------------- | ----------------------------- | ----------------------------------------------------------- |
| `controls`      | `ICustomDateFilterControls`        | Required                      | Supplies the four parent-owned reactive form controls.      |
| `idPrefix`      | `string`                           | Required                      | Sets a unique prefix for the generated field IDs and names. |
| `legendText`    | `string`                           | `'Filter by date'`            | Sets the radio group's legend text.                         |
| `legendClasses` | `string`                           | `'govuk-fieldset__legend--s'` | Sets additional CSS classes for the legend.                 |
| `dateHintText`  | `string`                           | `'For example, 31/01/2023'`   | Sets the hint shown for both date pickers.                  |
| `errors`        | `Readonly<Record<string, string>>` | `{}`                          | Supplies error messages keyed by generated field ID.        |

The `controls` input requires the following fields:

| Control      | Type                                          | Description                                               |
| ------------ | --------------------------------------------- | --------------------------------------------------------- |
| `dateFilter` | `FormControl<CustomDateFilterOption \| null>` | Stores `last7Days`, `customDays`, `dateRange`, or `null`. |
| `days`       | `FormControl<string \| null>`                 | Stores the custom number of days.                         |
| `dateFrom`   | `FormControl<string \| null>`                 | Stores the start date in `DD/MM/YYYY` format.             |
| `dateTo`     | `FormControl<string \| null>`                 | Stores the end date in `DD/MM/YYYY` format.               |

Supply a different `idPrefix` for each instance. Error messages use the IDs `<prefix>-days`, `<prefix>-date-from`,
and `<prefix>-date-to`. Use the same IDs in the parent's error summary.

Example use of optional inputs:

```html
<opal-lib-custom-date-filter
  idPrefix="account-search"
  [controls]="filtersForm.controls"
  [errors]="fieldErrors"
  legendText="Created date"
  legendClasses="govuk-fieldset__legend--m"
  dateHintText="For example, 01/06/2026"
></opal-lib-custom-date-filter>
```

## Outputs

There are no custom outputs for this component. User input updates the supplied reactive form controls directly.

## Methods

This component has no consumer-facing methods. Date picker events are handled internally.

The `clearInactiveCustomDateFilterFields` utility is available for consumers that need the same clearing behaviour
outside the component. It preserves fields for the selected option and clears inactive fields without emitting
control or parent form change events:

```typescript
import { clearInactiveCustomDateFilterFields } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/utils';

clearInactiveCustomDateFilterFields(this.filtersForm.controls, this.filtersForm.controls.dateFilter.value);
```

## Testing

Unit tests can be found in `custom-date-filter.component.spec.ts` and `utils/custom-date-filter.utils.spec.ts`.
To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
