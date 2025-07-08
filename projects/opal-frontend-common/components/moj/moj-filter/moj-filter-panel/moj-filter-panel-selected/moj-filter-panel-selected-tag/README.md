# MojFilterPanelSelectedTagComponent

The `MojFilterPanelSelectedTagComponent` is a subcomponent of `MojFilterPanelSelectedComponent` and is responsible for rendering a list of selected filters grouped by category. Each tag is rendered with an accessible label and a remove action.

## Features

- Displays selected filter tags grouped by their category
- Emits a removal event when a tag is clicked
- Supports accessible screen reader text via an input label prefix

## Usage

### Import

```ts
import { MojFilterPanelSelectedTagComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter-selected-tag
  [filterData]="abstractSelectedTags()"
  (removeTagClicked)="removeTag($event)"
></opal-lib-moj-filter-selected-tag>
```

## Inputs

| Input             | Type                             | Default                | Description                                                |
| ----------------- | -------------------------------- | ---------------------- | ---------------------------------------------------------- |
| `filterData`      | `IAbstractTableFilterCategory[]` | `[]`                   | The grouped list of selected tags by category              |
| `ariaLabelPrefix` | `string`                         | `'Remove this filter'` | Screen reader prefix applied to each tag's accessible name |

## Outputs

| Output             | Type                                                      | Description                                 |
| ------------------ | --------------------------------------------------------- | ------------------------------------------- |
| `removeTagClicked` | `{ categoryName: string; optionValue: string \| number }` | Emitted when a tag's remove link is clicked |

## Accessibility

- Each tag is prefixed with a visually hidden span (using `govuk-visually-hidden`) for screen reader clarity.
- The prefix is configurable via the `ariaLabelPrefix` input.

## Testing

Unit tests should verify:

- Tags are grouped and rendered correctly by category
- The `removeTagClicked` event is emitted with the correct shape
- The `ariaLabelPrefix` text appears in the correct visually hidden span
