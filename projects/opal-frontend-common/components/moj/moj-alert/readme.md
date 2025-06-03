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
For the base alert component you can import:
```typescript
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```

For the optional attachments you can import:
```typescript
import { MojAlertDismissComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertHeadingComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertIconComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```


## Usage

You can use the alert component in your template as follows:

```html
  <opal-lib-moj-alert type="success" [dismissible]="true" text="hello"></opal-lib-moj-alert>
```

You can add optional attachments in your template as follows:
```html
  <opal-lib-moj-alert type="success" heading="hello" text="hello">
    <opal-lib-moj-alert-icon icon type="success"></opal-lib-moj-alert-icon>
    <opal-lib-moj-alert-heading heading heading="hello"></opal-lib-moj-alert-heading>
    <opal-lib-moj-alert-dismiss dismiss></opal-lib-moj-alert-dismiss>
  </opal-lib-moj-alert>
```


## Inputs
For the base component these are the input fields:

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `type`        | `string` | Type of alert (e.g. success, information, error, warning)   |
| `text`        | `string` | Content text to be displayed in the body of the alert       |

For the Icon component these are the input fields:

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `type`        | `string` | Type of alert (e.g. success, information, error, warning)   |

For the Heading component these are the input fields:

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `heading`     | `string` | displays heading at the top of the alert in bold characters |

You additionally have to specify the select tag for each content projected component:

| component                      | select tag name          |
| ------------------------------ | ------------------------ | 
| `MojAlertHeadingComponent`     | 'heading'                | 
| `MojAlertIconComponent`        | 'icon'                   | 
| `MojAlertDismissComponent`     | 'dismiss'                | 




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
