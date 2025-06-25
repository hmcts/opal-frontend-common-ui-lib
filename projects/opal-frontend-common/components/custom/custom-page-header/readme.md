# Custom Page header Component

This Angular component provides a custom page header component, which will be used for the account enquiry flow and other flows throughout the program.

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
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { CustomPageHeaderActionButtonsContainerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-action-buttons-container';
import { CustomPageHeaderHeadingContainerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container';
import { CustomPageHeaderHeadingCaptionComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container/custom-page-header-heading-caption';
import { CustomPageHeaderHeadingTitleComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container/custom-page-header-heading-title';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';
import { MojButtonMenuItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu/moj-button-menu-item';
```

## Usage

You can use the custom page header component in your template as follows:

```html
<opal-lib-custom-page-header>
  <opal-lib-custom-page-header-heading-container>
    <opal-lib-custom-page-header-heading-caption pageHeaderCaption
      >ABD32D213d
    </opal-lib-custom-page-header-heading-caption>
    <opal-lib-custom-page-header-heading-title pageHeaderTitle>
      Mr dave smith
    </opal-lib-custom-page-header-heading-title>
  </opal-lib-custom-page-header-heading-container>
  <opal-lib-custom-page-header-action-buttons-container>
    <opal-lib-govuk-button buttonId="return">Return to account details</opal-lib-govuk-button>
    <opal-lib-moj-button-menu menuButtonTitle="More Options:">
      <opal-lib-moj-button-menu-item itemText="Option 1"></opal-lib-moj-button-menu-item>
      <opal-lib-moj-button-menu-item itemText="Option 2"></opal-lib-moj-button-menu-item>
      <opal-lib-moj-button-menu-item itemText="Option 3"></opal-lib-moj-button-menu-item>
    </opal-lib-moj-button-menu>
  </opal-lib-custom-page-header-action-buttons-container>
</opal-lib-custom-page-header>
```

## Inputs

There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-page-header.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
