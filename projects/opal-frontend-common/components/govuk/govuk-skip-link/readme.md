# GOV.UK Skip Link Component

This Angular component provides a GOV.UK-styled skip link that takes keyboard users directly to a target element on the page.

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
import { GovukSkipLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-skip-link';
```

## Usage

You can use the skip link component in your template as follows:

```html
<opal-lib-govuk-skip-link targetId="main-content" linkText="Skip to main content"></opal-lib-govuk-skip-link>

<main id="main-content">
  <!-- Application content -->
</main>
```

### Example in HTML

```html
<a class="govuk-skip-link" href="/current-page#main-content" data-module="govuk-skip-link">
  Skip to main content
</a>
```

The component prevents the default anchor navigation, then calls `focusElementById(targetId)` so the target element receives focus without changing the normal tab order.

## Inputs

| Input | Type | Description |
| ----- | ---- | ----------- |
| `targetId` | `string` | The ID of the element to focus when the skip link is activated. Defaults to `main-content`. |
| `linkText` | `string` | The visible text rendered inside the skip link. Defaults to `Skip to main content`. |

## Outputs

There are no custom outputs for this component.

## Methods

| Method | Description |
| ------ | ----------- |
| `onSkipLink(event: Event)` | Prevents the default navigation and focuses the configured target element. |

## Testing

Unit tests for this component can be found in the `govuk-skip-link.component.spec.ts` file.

To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
