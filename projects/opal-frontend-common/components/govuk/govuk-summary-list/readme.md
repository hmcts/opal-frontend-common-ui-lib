---

# GOV.UK Summary List Component

This Angular component provides a GOV.UK-styled summary list, typically used to display key-value pairs of information, such as user details or data summaries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
```

## Usage

You can use the summary list component in your template as follows:

```html
<opal-lib-govuk-summary-list summaryListId="exampleSummaryList">
  <div
    opal-lib-govuk-summary-list-row
    class="govuk-summary-list__row govuk-summary-list__row--no-actions"
    summaryListId="exampleSummaryList"
    summaryListRowId="row1"
  >
    <ng-container name>Name</ng-container>
    <ng-container value>
      <p class="govuk-body">Arnab Subedi</p>
    </ng-container>
  </div>
  <div
    opal-lib-govuk-summary-list-row
    class="govuk-summary-list__row govuk-summary-list__row--no-actions"
    summaryListId="exampleSummaryList"
    summaryListRowId="row2"
  >
    <ng-container name>Date of birth</ng-container>
    <ng-container value>
      <p class="govuk-body">01 January 1990</p>
    </ng-container>
  </div>
  <div
    opal-lib-govuk-summary-list-row
    class="govuk-summary-list__row"
    summaryListId="exampleSummaryList"
    summaryListRowId="row3"
    [actionEnabled]="true"
    (actionClick)="handleRoute('/change-date-of-birth')"
  >
    <ng-container name>Change Date of birth</ng-container>
    <ng-container value>
      <p class="govuk-body">01 January 1990</p>
    </ng-container>
    <ng-container action>Change</ng-container>
  </div>
</opal-lib-govuk-summary-list>
```

### Example in HTML:

```html
<dl class="govuk-summary-list">
  <div *ngFor="let item of items" class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">{{ item.key }}</dt>
    <dd class="govuk-summary-list__value">{{ item.value }}</dd>
    <dd class="govuk-summary-list__actions">
      <ng-content></ng-content>
    </dd>
  </div>
</dl>
```

## Inputs

| Input   | Type    | Description                                                    |
| ------- | ------- | -------------------------------------------------------------- |
| `items` | `Array` | Array of items where each item contains a `key` and a `value`. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-summary-list.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides a detailed explanation of how to use and configure the `govuk-summary-list` component to display key-value pairs in a summary list format.
