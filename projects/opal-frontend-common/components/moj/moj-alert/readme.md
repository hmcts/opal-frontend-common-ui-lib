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
import { MojAlertContentComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertHeadingComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertTextComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertIconComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
```


## Usage

You can use the alert component in your template as follows:

```html
  <opal-lib-moj-alert type="success" ariaLabel="hello" [showDismiss]="true"></opal-lib-moj-alert>
```

You can add optional attachments in your template as follows:
```html
   <div opal-lib-moj-alert ariaLabel="Your session will expire" type="warning">
        <opal-lib-moj-alert-icon icon type="warning"></opal-lib-moj-alert-icon>
        <opal-lib-moj-alert-content content>
          <opal-lib-moj-alert-content-heading>Warning</opal-lib-moj-alert-content-heading>
          <opal-lib-moj-alert-content-text>
             Your session will expire in {{ minutes }} {{ minutesText }}. Please save your work and
              log out, then log back in to continue."
            </opal-lib-moj-alert-content-text>
        </opal-lib-moj-alert-content-heading>
    </div>
```


## Inputs
For the base component these are the input fields:

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `type`        | `string` | Type of alert (e.g. success, information, error, warning)   |
| `ariaLabel`   | `string` | This helps to add accessibility for screen readers.         |
| `showDismiss` | 'boolean`| Optional boolean if set to True will show a dismiss button  |

For the Icon component these are the input fields:

| Input         | Type     | Description                                                 |
| ------------  | -------- | ---------------------------------------------------------   |
| `type`        | `string` | Type of alert (e.g. success, information, error, warning)   |



You additionally have to specify the select tag for each content projected component:

| component                      | select tag name          |
| ------------------------------ | ------------------------ | 
| `MojAlertIconComponent`        | 'icon'                   | 
| 'MojAlertContentComponent'     | 'content'                | 




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
