# MojFilterPanelHeaderComponent

The `MojFilterPanelHeaderComponent` is a structural header component used within the `MojFilterComponent`. It is designed to render a heading using the [MOJ Design System](https://design-patterns.service.justice.gov.uk/components/filter/) conventions.

This component is intended to be used inside the `[mojFilterPanelHeader]` slot of the `MojFilterComponent`.

## Features

- Renders a section header using MoJ-styled classes.
- Accepts a `title` input with a default value of `"Filter"`.
- Compatible with content projection (if needed).

## Usage

### Import

```ts
import { MojFilterPanelHeaderComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter-panel-header [title]="'Filter offences'"></opal-lib-moj-filter-panel-header>
```

## Inputs

| Input | Type   | Default  | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| title | string | 'Filter' | The title to display in the header |

## Accessibility

- Uses an `<h2>` element with the `govuk-heading-m` class for screen-reader-friendly headings.
- You can override the title text using the `title` input to ensure headings remain meaningful and contextual.

## Testing

Unit tests should verify:

- The default title renders as `"Filter"`.
- The custom title input renders correctly.
