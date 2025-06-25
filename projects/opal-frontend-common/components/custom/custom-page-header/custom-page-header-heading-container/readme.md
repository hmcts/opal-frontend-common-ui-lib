# Custom Page Header Heading Container Component

This Angular component provides a custom page header heading container, which will be used to wrap the caption and title of the page header and will be encapsulated by the main page header component.This is to apply the correct layout and styles for the elements.

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
import { CustomPageHeaderHeadingContainerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container';
import { CustomPageHeaderHeadingCaptionComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container/custom-page-header-heading-caption';
import { CustomPageHeaderHeadingTitleComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header/custom-page-header-heading-container/custom-page-header-heading-title';
```

## Usage

You can use the custom page header heading container component in your template as follows:

```html
<opal-lib-custom-page-header-heading-container>
  <opal-lib-custom-page-header-heading-caption pageHeaderCaption
    >ABD32D213d
  </opal-lib-custom-page-header-heading-caption>
  <opal-lib-custom-page-header-heading-title pageHeaderTitle> Mr dave smith </opal-lib-custom-page-header-heading-title>
</opal-lib-custom-page-header-heading-container>
```

## Inputs

There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-page-header-heading-container.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
