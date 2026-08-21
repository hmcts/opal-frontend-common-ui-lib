# MOJ Alert Component

This Angular component provides Ministry of Justice (MOJ)-styled alerts, typically used to display important announcements or notifications.

The component includes accessible screen reader announcements using a deferred ARIA live region. Announcements are deferred to ensure the live region is rendered before its content is populated, allowing assistive technologies to detect and announce the change reliably.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Accessibility](#accessibility)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

For the base alert component you can import:

```typescript
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```

For the optional attachments you can import:

```typescript
import {
  MojAlertContentComponent,
  MojAlertHeadingComponent,
  MojAlertTextComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```

## Usage

You can use the alert component in your template as follows:

```html
<opal-lib-moj-alert
  type="success"
  ariaLabel="Your changes have been saved"
  [showDismiss]="true"
  (dismissed)="handleDismissedAlert()"
></opal-lib-moj-alert>
```

You can add optional attachments in your template as follows:

```html
<div
  opal-lib-moj-alert
  ariaLabel="Your session will expire"
  type="warning"
>
  <opal-lib-moj-alert-icon icon type="warning"></opal-lib-moj-alert-icon>

  <opal-lib-moj-alert-content content>
    <h2 opal-lib-moj-alert-content-heading>Warning</h2>

    <opal-lib-moj-alert-content-text>
      Your session will expire in {{ minutes }} {{ minutesText }}.
      Please save your work and log out, then log back in to continue.
    </opal-lib-moj-alert-content-text>
  </opal-lib-moj-alert-content>
</div>
```

## Accessibility

The MOJ Alert component uses a deferred ARIA live region internally to announce alerts to screen readers. Consumers do not need to provide their own live region or ARIA role.

## Inputs

For the base component these are the input fields:

| Input         | Type           | Description |
| ------------- | -------------- | ----------- |
| `type`        | `MojAlertType` | Type of alert: `success`, `information`, `error`, or `warning`. The type also determines the live-region role. |
| `ariaLabel`   | `string`       | Required text used to construct the screen reader announcement. |
| `showDismiss` | `boolean`      | Optional. When `true`, displays a dismiss button. |

For the Icon component these are the input fields:

| Input  | Type     | Description |
| ------ | -------- | ----------- |
| `type` | `string` | Type of alert (e.g. `success`, `information`, `error`, or `warning`). |

You additionally have to specify the select tag for each content projected component:

| Component                  | Select tag name |
| -------------------------- | --------------- |
| `MojAlertIconComponent`    | `icon`          |
| `MojAlertContentComponent` | `content`       |

## Outputs

| Output      | Type    | Description |
| ----------- | ------- | ----------- |
| `dismissed` | `Event` | Emits an event for the parent to capture when the alert is dismissed. |

## Methods

There are no public custom methods that consumers need to call directly.

Alert dismissal is handled internally when the dismiss button is used, with the `dismissed` output available to notify the parent component.

## Testing

Unit and integration tests for this component can be found in the `moj-alert.component.spec.ts` file.

To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
