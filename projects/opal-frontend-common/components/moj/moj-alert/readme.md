---

# MOJ Alert Component

This Angular component provides a Ministry of Justice (MOJ)-styled Alerts, typically used to display important announcements or notifications.

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
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```

## Usage

You can use the alert component in your template as follows:

```html
  <opal-lib-moj-alert type="success" [dismissible]="true" text="hello"></opal-lib-moj-alert>
```

## Inputs

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `type`        | `string` | Type of alert (e.g. success, information, error, warning)   |
| `dismissible` | `boolean`| Optional button to allow users to remove the error message  |
| `icon`        | `boolean`| Optional Icon for the alerts                                |
| `text`        | `string` | Content text to be displayed in the body of the alert       |
| `heading`     | `string` | Heading text to be displayed in the header of the alert     |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-alert.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
