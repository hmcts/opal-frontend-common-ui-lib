---
# GOV.UK Error Message Component

This Angular component implements the GOV.UK-styled error messages, providing a way to display error messages on form elements and also native elements. 

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
import { GovUkErrorMessageComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-message';
```

## Usage

You can use the error summary component in your template as follows:

```html
<opal-lib-gov-uk-error-message error="Add minor creditor details" elementId="error-message"> </opal-lib-gov-uk-error-message>
```

### Example in HTML:

```html
<opal-lib-gov-uk-error-message  
  [error]="minorCreditorMissing"  
  errorMessage="Add minor creditor details"  
  elementId="error-message"  
>  
  <a  
    class="govuk-link govuk-link--no-visited-state"  
    (click)="goToMinorCreditor(rowIndex)"  
    (keyup.enter)="goToMinorCreditor(rowIndex)"  
    tabindex="0"  
  >  
    Add minor creditor details  
  </a>  
</opal-lib-gov-uk-error-message> 
```

## Inputs

| Input          | Type     | Description                                                            |
| -------------- | -------- | ---------------------------------------------------------------------- |
| `error`        | `boolean`| A boolean value thats used to check if there is an error.              |
| `errorMessage` | `string` | Input for the error message to be displayed                            |
| `elementId`    | `string` | The id of the host element that the error message will be attached to. |


## Outputs

There are no custom outputs for this component.

## Methods

There are no methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-error-summary.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
