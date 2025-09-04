---

# MOJ Notification Badge Component

This Angular component provides a Ministry of Justice (MOJ)-styled notification badge that displays labels or status indicators.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `MojNotificationBadgeComponent` in your project, ensure that the component is imported and declared.

```typescript
import { MojNotificationBadgeComponent } from '@components/moj/moj-badge/moj-notification-badge.component';
```

## Usage

You can use the notification badge component in your template as follows:

```html
<opal-lib-moj-notification-badge badgeId="badge1">Lorem ipsum 1</opal-lib-moj-badge>
```

### Example in HTML:

```html
<span class="moj-notification-badge" [id]="badgeId"><ng-content></ng-content></span>
```

## Inputs

| Input          | Type     | Description                                       |
| -------------- | -------- | ------------------------------------------------- |
| `badgeId`      | `string` | The unique identifier for the badge element.      |

## Testing

Unit tests for this component can be found in the `moj-notification-badge.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component. When contributing, ensure changes follow Angular and MOJ design system best practices.

---

This `README.md` provides an overview of the `moj-notification-badge` component, including usage and inputs.
