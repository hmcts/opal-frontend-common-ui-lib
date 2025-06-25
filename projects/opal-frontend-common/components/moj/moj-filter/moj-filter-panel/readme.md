# MOJ Filter Panel Component

This Angular component provides a Ministry of Justice (MOJ)-styled filter panel for filtering table data with tags and categories. It follows the Ministry of Justice (MoJ) Filter Panel design pattern and uses Angular signals for reactive filtering, enabling efficient and responsive user interactions.

## Subcomponents

- `MojFilterPanelContentComponent`
- `MojFilterPanelContentHeaderComponent`
- `MojFilterPanelContentOptionComponent`
- `MojFilterPanelContentOptionFormGroupKeywordComponent`
- `MojFilterPanelContentOptionsFormGroupItemComponent`
- `MojFilterPanelContentSelectedComponent`
- `MojFilterPanelContentSelectedTagComponent`

## Slot Usage

This component uses named slots to organize content:

- `mojFilterPanelHeader`: Slot for the filter panel header.
- `mojFilterPanelSelected`: Slot for displaying selected filter tags.
- `mojFilterPanelOption`: Slot for filter options and controls.

## Usage

To use the MOJ Filter Panel component, wrap it in a parent component and provide the necessary filter data and event handlers. Example usage:

```html
<opal-lib-moj-filter-panel>
  <ng-container mojFilterPanelHeader>
    <opal-lib-moj-filter-panel-header title="Filter"></opal-lib-moj-filter-panel-header>
  </ng-container>

  <ng-container mojFilterPanelSelected>
    <opal-lib-moj-filter-panel-selected (clearFilters)="clearAllFilters()">
      <opal-lib-moj-filter-panel-selected-tag
        [filterData]="selectedTags"
        (removeTagClicked)="removeTag($event)"
      ></opal-lib-moj-filter-panel-selected-tag>
    </opal-lib-moj-filter-panel-selected>
  </ng-container>

  <ng-container mojFilterPanelOption>
    <opal-lib-moj-filter-panel-option (applyFilters)="applyFilters()">
      <ng-container mojFilterPanelKeyword>
        <opal-lib-moj-filter-panel-option-form-group-keyword
          (keywordChange)="onKeywordChange($event)"
        ></opal-lib-moj-filter-panel-option-form-group-keyword>
      </ng-container>

      <ng-container mojFilterPanelItems>
        <opal-lib-moj-filter-panel-options-form-group-item
          *ngFor="let category of filterCategories"
          [options]="category"
          (changed)="onCategoryChange($event)"
        ></opal-lib-moj-filter-panel-options-form-group-item>
      </ng-container>
    </opal-lib-moj-filter-panel-option>
  </ng-container>
</opal-lib-moj-filter-panel>
```

## Testing

Run the tests with:

```bash
yarn test
```

## Contributing

Contributions are welcome. Please submit issues or pull requests to improve this component.
