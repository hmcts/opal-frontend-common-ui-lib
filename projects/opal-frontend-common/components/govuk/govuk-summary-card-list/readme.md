---

# GOV.UK Summary Card List Component

This Angular component is used to render a list of summary cards, each card providing a summary of key information with GOV.UK styling.

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
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
```

## Usage

You can use the summary card list component in your template as follows:

```html
<opal-lib-govuk-summary-card-list 
  summaryCardListId="summaryCard"
  cardTitle="Summary Card"
  [contentHidden]="false"
  [headingLevel]="2"
>
  <ng-container actions>...</ng-container>
  <ng-container content>...</ng-container>
</opal-lib-govuk-summary-card-list>
```

### Example in HTML:

```html
<ul class="govuk-summary-card-list">
  <li *ngFor="let card of cards" class="govuk-summary-card">
    <!-- Card content here -->
    <opal-lib-govuk-summary-card 
      [summaryCardListId]="card.id"
      [cardTitle]="card.title"
      [contentHidden]="false"
      [headingLevel]="2"
    >
    <ng-container actions>
      <li
        opal-lib-govuk-summary-card-action
        [actionText]="isDetailsHidden ? 'Show details' : 'Hide details'"
        actionRoute="showHideDetails"
        (clickEvent)="summaryListActionClick($event)"
      ></li>
    </ng-container>
    <ng-container content>
      <p>Summary content...</p>
    </ng-container>
    </opal-lib-govuk-summary-card>
  </li>
</ul>
```

## Inputs

| Input               | Type      | Description                                                                                       |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `summaryCardListId` | `String`  | An string to be used as an id for the wrapping HTML element.                                      |
| `cardTitle`         | `String`  | An string to be used as the heading text on the card.                                             |
| `contentHidden`     | `Boolean` | A boolean which dictates whether the content of the card should be hidden.                        |
| `headingLevel`      | `Number`  | A number between 1 and 6 which dictates the heading level for the title. Default is 2 (H2)        |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-summary-card-list.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use the `govuk-summary-card-list` component to display a list of summary cards with key information.
