# MojFilterPanelOptionComponent

The `MojFilterPanelOptionComponent` is a structural subcomponent of `MojFilterComponent` used to wrap and layout filter controls and the "Apply filters" button using MoJ styling conventions.

This component provides a submit button and two content projection slots:

- `[mojFilterPanelKeyword]` — typically used to project a keyword input component
- `[mojFilterPanelItems]` — typically used to project checkbox groups per filter category

## Features

- GOV.UK-styled apply button
- Emits a `applyFilters` event when clicked
- Allows keyword and category controls to be projected via slots

## Usage

### Import

```ts
import { MojFilterPanelOptionComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter-panel-option (applyFilters)="onApplyFilters()">
  <ng-container mojFilterPanelKeyword>
    <opal-lib-moj-filter-panel-option-form-group-keyword
      (keywordChange)="onKeywordChange($event)"
    ></opal-lib-moj-filter-panel-option-form-group-keyword>
  </ng-container>
  <ng-container mojFilterPanelItems>
    @for (item of filterTags(); track item.categoryName) {
    <opal-lib-moj-filter-panel-option-form-group-item
      [options]="item"
      (changed)="onCategoryCheckboxChange($event)"
    ></opal-lib-moj-filter-panel-option-form-group-item>
    }
  </ng-container>
</opal-lib-moj-filter-panel-option>
```

## Inputs

| Input        | Type     | Default           | Description                            |
| ------------ | -------- | ----------------- | -------------------------------------- |
| `buttonText` | `string` | `'Apply filters'` | The text displayed on the apply button |

## Outputs

| Output         | Type   | Description                              |
| -------------- | ------ | ---------------------------------------- |
| `applyFilters` | `void` | Emitted when the apply button is clicked |

## Content Projection Slots

| Slot                      | Description                                   |
| ------------------------- | --------------------------------------------- |
| `[mojFilterPanelKeyword]` | Slot for projecting a keyword input component |
| `[mojFilterPanelItems]`   | Slot for projecting category checkbox groups  |

## Accessibility

- Uses a GOV.UK button with `data-module="govuk-button"` and `type="button"`.
- Consumers should ensure appropriate ARIA labelling for projected input fields.

## Testing

Unit tests should verify:

- The apply button renders with custom `buttonText`
- The `applyFilters` output emits on click
- Projected content is rendered in the appropriate slot

## Related Subcomponents

The following components are typically projected into this component via the documented slots:

- [`MojFilterPanelOptionFormGroupKeywordComponent`](../moj-filter-panel-option-form-group-keyword) – renders a GOV.UK text input for keyword filtering
- [`MojFilterPanelOptionFormGroupItemComponent`](../moj-filter-panel-option-form-group-item) – renders checkbox groups per filter category
