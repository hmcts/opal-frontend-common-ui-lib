# Custom Deferred Live Region Announcement Component

This Angular component provides a live region for announcing dynamic content to assistive technologies. It supports `status` and `alert` roles and defers browser-side population of the live region so assistive technologies can register the empty region before its content changes.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { CustomDeferredLiveRegionAnnouncement } from '@hmcts/opal-frontend-common/components/custom/custom-deferred-live-region-announcement';
```

## Usage

You can use the Custom Deferred Live Region Announcement component in your template as follows:

```html
<opal-lib-custom-deferred-live-region-announcement [message]="announcementMessage" role="status" ></opal-lib-custom-deferred-live-region-announcement>
```

For an urgent announcement, use the `alert` role:

```html
<opal-lib-custom-deferred-live-region-announcement [message]="announcementMessage" role="alert" ></opal-lib-custom-deferred-live-region-announcement>
```

The component uses a default announcement delay of 100 milliseconds. This can be overridden when required based on supported assistive technology and browser testing:

```html
<opal-lib-custom-deferred-live-region-announcement
  [message]="announcementMessage"
  role="status"
  [announcementDelayMs]="200"
></opal-lib-custom-deferred-live-region-announcement>
```

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | Required | Sets the text to be announced by the live region. |
| `role` | `status` \| `alert` | `status` | Sets the ARIA role used by the live region. |
| `announcementDelayMs` | `number` | `100` | Sets the delay in milliseconds before the live region is populated. Must be a non-negative finite number. |

Example use of inputs:

```html
<opal-lib-custom-deferred-live-region-announcement [message]="NO_RESULTS_ANNOUNCEMENT" role="status" [announcementDelayMs]="200" ></opal-lib-custom-deferred-live-region-announcement>
```

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Accessibility

The component renders a visually hidden native `<output>` element that acts as a live region for assistive technologies.

During server-side rendering, the live region remains empty. Announcement scheduling occurs only in the browser after the component has rendered. This allows assistive technologies to register the empty live region before its content is populated.

When `message` is provided or changes, any pending announcement is cancelled, the existing live region content is cleared, and the latest message is populated after the configured announcement delay.

The component supports the following roles:

- `status` — for non-urgent status information that should be announced without interrupting the user.
- `alert` — for important or urgent information that should be announced immediately.

The live region uses `aria-atomic="true"` so that the complete announcement is presented when its content changes.

The announcement delay defaults to `100` milliseconds and can be configured using `announcementDelayMs` based on supported assistive technology and browser testing. The value must be a non-negative finite number.

When the announcement delay changes, any pending announcement is cancelled and rescheduled using the new delay. If no announcement is pending, the new delay applies to future announcements.

## Testing

Unit tests for this component can be found in the `custom-deferred-live-region-announcement.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
