# Abstract Report Summary List Base Component

This Angular component serves as a foundational base class for report summary list screens that use common date-filter
behaviour. It provides shared state, date query helpers, date validation helpers, error summary messages, and report
status display helpers.

It does not provide a shared template, route, API integration, table, or report journey. Consuming applications remain
responsible for their concrete form structure, page layout, routing, service calls, report metadata, and any
application-specific filters.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Ownership Model](#ownership-model)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractReportSummaryListBaseComponent` in your project, extend it in a report summary component:

```typescript
import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
```

Import constants, interfaces, and types from their dedicated secondary entry points:

```typescript
import {
  ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
  ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import {
  IAbstractReportSummaryListDateFormats,
  IAbstractReportSummaryListDateValidationMessages,
  IAbstractReportSummaryListFilterState,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/interfaces';
import { AbstractReportSummaryListDateFilter } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/types';
```

## Usage

This component is designed to be extended by report summary list components to provide consistent report date-filter
handling without prescribing the consuming application's full form or page structure.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import {
  IAbstractReportSummaryListDateValidationMessages,
  IAbstractReportSummaryListFilterState,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/interfaces';
import { AbstractReportSummaryListDateFilter } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/types';

type ReportFiltersForm = FormGroup<{
  dateFilter: FormControl<AbstractReportSummaryListDateFilter | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
}>;

const REPORT_DATE_FORMATS: IAbstractReportSummaryListDateFormats = {
  input: 'dd/MM/yyyy',
  output: 'yyyy-MM-dd',
};

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
})
export class ReportSummaryComponent extends AbstractReportSummaryListBaseComponent<ReportFiltersForm> {
  protected override readonly dateFormats = REPORT_DATE_FORMATS;

  public readonly filtersForm: ReportFiltersForm = new FormGroup({
    dateFilter: new FormControl<AbstractReportSummaryListDateFilter | null>(this.dateFilterLast7Days),
    days: new FormControl<string | null>(''),
    dateFrom: new FormControl<string | null>(''),
    dateTo: new FormControl<string | null>(''),
  });

  protected readonly dateValidationMessages: IAbstractReportSummaryListDateValidationMessages = {
    customDaysRequired: 'Enter number of days',
    dateRangeRequired: 'You must enter at least 1 of date from or date to',
    invalidDate: 'Date must be in the format DD/MM/YYYY',
    futureDate: 'Date cannot be in the future',
    dateFromAfterDateTo: 'The Date from cannot be after the Date to',
  };

  protected getFiltersFromForm(filtersForm: ReportFiltersForm): IAbstractReportSummaryListFilterState {
    return {
      dateFilter: filtersForm.controls.dateFilter.value ?? this.dateFilterLast7Days,
      days: filtersForm.controls.days.value ?? '',
      dateFrom: filtersForm.controls.dateFrom.value ?? '',
      dateTo: filtersForm.controls.dateTo.value ?? '',
    };
  }

  protected clearInactiveDateFilterFields(
    filtersForm: ReportFiltersForm,
    dateFilter: AbstractReportSummaryListDateFilter | null,
  ): void {
    if (dateFilter !== this.dateFilterCustomDays) {
      filtersForm.controls.days.setValue('', { emitEvent: false });
    }

    if (dateFilter !== this.dateFilterDateRange) {
      filtersForm.controls.dateFrom.setValue('', { emitEvent: false });
      filtersForm.controls.dateTo.setValue('', { emitEvent: false });
    }
  }
}
```

## Properties

The component provides public and protected properties for report date-filter management:

| Property                    | Type                                              | Description                                                   |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `dateFilterLast7Days`       | `string`                                          | Constant value for the last 7 days date filter.               |
| `dateFilterCustomDays`      | `string`                                          | Constant value for the custom days date filter.               |
| `dateFilterDateRange`       | `string`                                          | Constant value for the date range date filter.                |
| `dateFilter`                | `WritableSignal<AbstractReportSummaryListDateFilter>` | Current selected date filter.                             |
| `errorSummaryMessages`      | `Signal<IAbstractFormBaseFormErrorSummaryMessage[]>`  | Error summary messages derived from the field error map.   |
| `dateFormats`               | `IAbstractReportSummaryListDateFormats`               | Consumer-overridable input and output date formats.        |
| `dateValidationMessages`    | `IAbstractReportSummaryListDateValidationMessages`    | Consumer-defined validation messages for date fields.      |

## Methods

### Static Methods

| Method                             | Parameters                                                                    | Description                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `getDefaultReportQuery()`          | `dateService: DateService, dateFormats?: IAbstractReportSummaryListDateFormats` | Builds a date query for the last 7 days.                                  |
| `getReportQueryFromFilters()`      | `filters: IAbstractReportSummaryListFilterState, dateService: DateService, dateFormats?: IAbstractReportSummaryListDateFormats` | Converts date-filter state into a report date query. |
| `getReportInstanceDisplayStatus()` | `status: string, records?: number \| null, displayName?: string \| null`      | Converts a report instance status into display text.                        |
| `toReportDisplayStatus()`          | `status: string`                                                              | Converts a status code into title-case display text.                        |

### Public Methods

| Method            | Parameters        | Description                                              |
| ----------------- | ----------------- | -------------------------------------------------------- |
| `getFieldError()` | `fieldId: string` | Returns the current validation message for a field.      |

### Protected Methods

| Method                            | Parameters                                                               | Description                                                                 |
| --------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `getDefaultReportQuery()`         | —                                                                        | Builds a default date query for the current component instance.             |
| `getReportQueryFromFilters()`     | `filters: IAbstractReportSummaryListFilterState`                         | Converts date-filter state into a date query using the injected date service. |
| `getFiltersFromForm()`            | `filtersForm: TFilterForm`                                               | Abstract hook that maps the consumer's form into common date-filter state.  |
| `clearInactiveDateFilterFields()` | `filtersForm: TFilterForm, dateFilter: AbstractReportSummaryListDateFilter \| null` | Abstract hook for clearing inactive consumer form fields.        |
| `buildReportDateFieldErrors()`    | `filters: IAbstractReportSummaryListFilterState, fieldIds: IAbstractReportSummaryListDateFieldIds` | Builds date validation errors for the active date filter. |
| `isReportDateInvalid()`           | `value: string`                                                          | Returns `true` when a date string is invalid.                               |
| `isReportDateInFuture()`          | `value: string`                                                          | Returns `true` when a valid date string is in the future.                   |
| `isReportDateFromAfterDateTo()`   | `dateFrom: string, dateTo: string`                                       | Returns `true` when date from is after date to.                             |

## Interfaces

The component uses several interfaces and types for type safety and structure:

1. **Date Filter Contracts**:
   - `AbstractReportSummaryListDateFilter`: Supported date filter values: `last7Days`, `customDays`, and `dateRange`
   - `IAbstractReportSummaryListFilterState`: Common date-filter state
   - `IAbstractReportSummaryListQueryState`: Common date query state with `fromDate` and `toDate`

2. **Validation Contracts**:
   - `IAbstractReportSummaryListDateFieldIds`: Consumer-provided field ids for date validation messages
   - `IAbstractReportSummaryListDateFormats`: Consumer-provided input and output date formats
   - `IAbstractReportSummaryListDateValidationMessages`: Consumer-provided validation copy

## Ownership Model

**Shared by this base class:**

- Current date-filter state
- Error summary message generation
- Date query helpers
- Date validation helpers
- Report instance status display helpers

**Owned by the consuming application:**

- Concrete form controls and control names
- Mapping from the concrete form to `IAbstractReportSummaryListFilterState`
- Application-specific filters, such as business unit
- Input and output date formats where they differ from the default `dd/MM/yyyy` to `yyyy-MM-dd` contract
- Validation message copy
- Routing, API calls, report metadata, page layout, and table markup

## Testing

Unit tests should cover:

- Default date query creation
- Custom days query creation
- Date range query creation
- Consumer form mapping through `getFiltersFromForm()`
- Consumer inactive field clearing through `clearInactiveDateFilterFields()`
- Date validation messages for required, invalid, future, and out-of-order dates
- Report instance status display mapping

## Contributing

Keep this base limited to behaviour that is stable across report summary list consumers. Do not add report-specific
templates, routing, API calls, business filters, or journey-specific behaviour to this shared abstraction.
