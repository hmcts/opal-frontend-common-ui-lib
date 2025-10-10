# GOV.UK Heading with Caption Component

This Angular component displays a heading with an optional caption, styled according to GOV.UK standards.

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
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
```

## Usage

You can use the heading with caption component in your template as follows:

```html
<opal-lib-govuk-heading-with-caption
  [captionText]="'Page subtitle'"
  [headingText]="'Main heading'"
></opal-lib-govuk-heading-with-caption>
```

### Example with different heading levels:

```html
<!-- Default h1 heading -->
<opal-lib-govuk-heading-with-caption
  [captionText]="'HY35014'"
  [headingText]="'Riding a bicycle on a footpath'"
></opal-lib-govuk-heading-with-caption>

<!-- Changing heading level to h2 -->
<opal-lib-govuk-heading-with-caption
  [captionText]="'HY35014'"
  [headingText]="'Riding a bicycle on a footpath'"
  [headingLevel]="2"
></opal-lib-govuk-heading-with-caption>
```

## Inputs

| Input          | Type     | Default | Description                                                            |
| -------------- | -------- | ------- | ---------------------------------------------------------------------- |
| `captionText`  | `string` | None    | The caption text displayed inside the heading                          |
| `headingText`  | `string` | None    | The main heading                                                       |
| `headingLevel` | `string` | 1       | The heading level (1-6). Determines which HTML heading element to use. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-heading-with-caption.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
