# MojFilterComponent

The `MojFilterComponent` provides the structural and behavioural layout wrapper for the Ministry of Justice filter pattern. It combines the `.moj-filter-layout` structure with toggleable sidebar behaviour for showing and hiding filter controls responsively.

This component should wrap both the filter panel and the table or content area using named `ng-content` slots, and is intended to be used in conjunction with the `MojFilterPanelComponent`, `MojFilterPanelHeaderComponent`, and `MojFilterPanelOptionComponent`.

## Features

- Renders the `.moj-filter-layout` wrapper
- Projects filter and content areas using `[mojFilterPanel]` and `[mojFilterContent]` slots
- Provides a toggle button to show/hide the filter panel with ARIA support
- Defaults to `showFilter = false`, but can be overridden

## Usage

### Import

```ts
import { MojFilterComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter>
  <ng-container mojFilterPanel>
    <opal-lib-moj-filter-panel>
      <ng-container mojFilterPanelHeader>
        <opal-lib-moj-filter-panel-header title="Filter"></opal-lib-moj-filter-panel-header>
      </ng-container>
      <ng-container mojFilterPanelSelected>
        <opal-lib-moj-filter-panel-selected (clearFilters)="clearAllFilters()">
          <opal-lib-moj-filter-panel-selected-tag
            [filterData]="abstractSelectedTags()"
            (removeTagClicked)="removeTag($event.categoryName, $event.optionValue)"
          />
        </opal-lib-moj-filter-panel-selected>
      </ng-container>
      <ng-container mojFilterPanelOption>
        <opal-lib-moj-filter-panel-option (applyFilters)="onApplyFilters()">
          <ng-container mojFilterPanelKeyword>
            <opal-lib-moj-filter-panel-option-form-group-keyword (keywordChange)="onKeywordChange($event)" />
          </ng-container>
          <ng-container mojFilterPanelItems>
            @for (item of filterTags(); track item.categoryName) {
            <div
              opal-lib-moj-filter-panel-options-form-group-item
              [options]="item"
              (changed)="onCategoryCheckboxChange(item.categoryName, $event.item.value, $event.item.selected)"
            ></div>
            }
          </ng-container>
        </opal-lib-moj-filter-panel-option>
      </ng-container>
    </opal-lib-moj-filter-panel>
  </ng-container>

  <ng-container mojFilterContent>
    <!-- Your table or filtered content goes here -->
  </ng-container>
</opal-lib-moj-filter>
```

## Inputs

| Input        | Type      | Default | Description                                    |
| ------------ | --------- | ------- | ---------------------------------------------- |
| `showFilter` | `boolean` | `false` | Whether the filter panel is visible by default |

## Accessibility

- The toggle button is associated with `aria-controls="filter"` and dynamically updates `aria-expanded`.
- The filter panel uses `[hidden]` for screen reader compatibility.

## Testing

Unit tests should verify:

- Default and toggled state of `showFilter`
- Toggle button updates both visibility and ARIA attributes
- `mojFilterPanel` and `mojFilterContent` content is projected correctly
