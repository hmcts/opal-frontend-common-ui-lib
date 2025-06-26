# Custom Page Header Action Buttons Container Component

This Angular component provides a custom page header action buttons container component, which will be used to contain the different action buttons such as govuk buttons and Moj buttons that will be encapsulated by this component.The component will apply correct layout and styling to the buttons for the page header component.

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
import { CustomPageHeaderActionButtonsContainerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-action-buttons-container';
```

## Usage

You can use the custom page header action buttons container component in your template as follows:

```html
<opal-lib-custom-page-header-action-buttons-container>
  <opal-lib-govuk-button buttonId="return" buttonClasses="govuk-button--secondary"
    >Return to account details</opal-lib-govuk-button
  >
  <opal-lib-moj-button-menu menuButtonTitle="More Options:">
    <opal-lib-moj-button-menu-item itemText="Option 1"></opal-lib-moj-button-menu-item>
    <opal-lib-moj-button-menu-item itemText="Option 2"></opal-lib-moj-button-menu-item>
    <opal-lib-moj-button-menu-item itemText="Option 3"></opal-lib-moj-button-menu-item> </opal-lib-moj-button-menu
></opal-lib-custom-page-header-action-buttons-container>
```

## Inputs

There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-page-header-action-buttons-container.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
