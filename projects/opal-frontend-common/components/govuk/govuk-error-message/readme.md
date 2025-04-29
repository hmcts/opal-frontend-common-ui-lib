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
import { GovukErrorMessageComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-message';
```

## Usage

You can use the error summary component in your template as follows:

```html
<opal-lib-govuk-error-message [error]= "minorCreditorMissing" errorMessage = "Add minor creditor details" elementId="error-message"> </opal-lib-govuk-error-message>
```

### Example in HTML:

```html
<opal-lib-govuk-error-message  
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
</opal-lib-govuk-error-message> 
```

## Inputs

| Input          | Type     |Description                                                             |
| -------------- | -------- |----------------------------------------------------------------------  |
| `error`        | `boolean`| A boolean value that’s used to determine if an error is present.       |
| `errorMessage` | `string` | The error message to display when an error is present.                 |
| `elementId`    | `string` | The ID to associate with the error message element for accessibility   |


## Outputs

There are no custom outputs for this component.

## Methods

There are no methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-error-message.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
