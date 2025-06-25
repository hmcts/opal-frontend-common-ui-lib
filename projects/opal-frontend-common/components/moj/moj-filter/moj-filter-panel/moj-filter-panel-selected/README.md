# MojFilterPanelSelectedComponent

The `MojFilterPanelSelectedComponent` is a structural subcomponent of the `MojFilterComponent`. It is responsible for rendering the selected filter heading and a clear filters action link. It typically wraps the `MojFilterPanelSelectedTagComponent` to show the selected tag groups.

## Features

- Displays a heading and a "Clear filters" link using MoJ styles
- Emits an event to clear all filters
- Supports projecting selected tag display via `<ng-content>`

## Usage

### Import

```ts
import { MojFilterPanelSelectedComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter-panel-selected (clearFilters)="clearAllFilters()">
  <opal-lib-moj-filter-panel-selected-tag
    [filterData]="abstractSelectedTags()"
    (removeTagClicked)="removeTag($event)"
  ></opal-lib-moj-filter-panel-selected-tag>
</opal-lib-moj-filter-panel-selected>
```

## Inputs

| Input          | Type   | Default            | Description                               |
| -------------- | ------ | ------------------ | ----------------------------------------- |
| `headingLabel` | string | 'Selected filters' | The heading text above the selected tags  |
| `linkLabel`    | string | 'Clear filters'    | The label text for the clear filters link |

## Outputs

| Output         | Type | Description                            |
| -------------- | ---- | -------------------------------------- |
| `clearFilters` | void | Emitted when the clear link is clicked |

## Accessibility

- Heading uses `<h2>` with `govuk-heading-m` for screen reader support
- "Clear filters" is rendered as a link (`<a>`) for consistency with MoJ pattern
- The entire region is enclosed in `.moj-filter__selected` and `.moj-filter__selected-heading` wrappers

## Testing

Unit tests should verify:

- Default and custom `headingLabel` and `linkLabel` render
- The `clearFilters` event emits when the link is clicked
- Projected content inside `<ng-content>` renders as expected
