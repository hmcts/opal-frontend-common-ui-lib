# MOJ Timeline Item Component

This Angular component represents an individual event in an MOJ-styled timeline. The event content is supplied through content projection using the `title`, `user`, `date`, and `description` attribute selectors.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Projected content](#projected-content)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the standalone component from the `moj-timeline` entry point:

```typescript
import { MojTimelineItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-timeline';
```

Add `MojTimelineItemComponent` to the `imports` array of the standalone component that uses it.

## Usage

Use the component inside an `opal-lib-moj-timeline` element and provide each event field using its corresponding attribute selector:

```html
<opal-lib-moj-timeline-item [headingLevel]="3">
  <span title>Application submitted</span>
  <span user>Alex Smith</span>
  <span date>23/07/2024</span>
  <div description>
    <p>The application was submitted for review.</p>
  </div>
</opal-lib-moj-timeline-item>
```

`headingLevel` controls the heading element used for the title. It defaults to `2`, so the title is rendered as an `h2` when the input is omitted.

## Inputs

| Input          | Type           | Default | Description |
| -------------- | -------------- | ------- | ----------- |
| `headingLevel` | `HeadingLevel` | `2`     | The heading level used for the projected title. Supported values are `1` through `6`. |

## Projected content

The component does not expose `date`, `user`, `title`, or `description` as Angular inputs. Project content into the matching attribute selector instead:

| Selector        | Description |
| --------------- | ----------- |
| `[title]`       | The event title, rendered using the configured heading level. |
| `[user]`        | The user shown in the event byline. |
| `[date]`        | The event date. |
| `[description]` | The event description. This can contain text or other HTML content. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in `moj-timeline-item.component.spec.ts`. To run the test suite, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
