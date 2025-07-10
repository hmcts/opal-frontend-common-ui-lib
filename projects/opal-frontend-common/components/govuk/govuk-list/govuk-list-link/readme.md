# GOV.UK List Link Component

This Angular component renders a single GOV.UK-styled list link, intended to be content projected into the parent `govuk-list` component to build a complete styled list.  

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
import { GovukListLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list/govuk-list-link';
```

## Usage

You can use the list link component in your template as follows:

```html
<opal-lib-govuk-list-link
  linkText="Add enforcement action"
  (linkClickEvent)="linkClickEvent1()"
></opal-lib-govuk-list-link>
```

This component creates a list item with a link inside that inputs a link text and outputs a list event that can be captured by the parent.

## Inputs

| Input      | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `linkText` | `string` | The text displayed inside of the link. |

## Outputs

| Output           | Type    | Description                                                                                                |
| ---------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `linkClickEvent` | `Event` | Emits an empty event when the link is clicked which can be captured by the parent to perform link actions. |

Example of event captured by parent:

```html
<opal-lib-govuk-list-link
  linkText="Add enforcement action"
  (linkClickEvent)="linkClickEvent1()"
></opal-lib-govuk-list-link>
```

```typescript
 public linkClickEvent1(): void {
    console.log('Link 1 clicked');
  }
```

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-list-link.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
