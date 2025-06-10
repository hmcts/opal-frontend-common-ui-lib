---

# MOJ Filter Component

This Angular component provides a Ministry of Justice (MOJ)-styled filter.

## Table of Contents

- [Usage](#usage)
- [Inputs](#inputs)
- [Testing](#testing)
- [Contributing](#contributing)

## Usage

First you have to create a new component as the wrapper for your filter component.This should be seperate from your parent component. It should be something like this:


```typescript
    import { Component, Output, Input } from '@angular/core';
    import { AbstractFilterComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-filter';
    import { MojFilterComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterHeaderComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterOptionComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterOptionFormGroupKeywordComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterOptionsFormGroupComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterSelectedComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { MojFilterSelectedTagComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
    import { IFilterOption } from '@hmcts/opal-frontend-common/components/moj/moj-filter/interfaces/filter-interfaces';
    @Component({
        selector: 'app-filter-wrapper',
        imports: [
            MojFilterComponent,
            MojFilterHeaderComponent,
            MojFilterOptionComponent,
            MojFilterOptionFormGroupKeywordComponent,
            MojFilterOptionsFormGroupComponent,
            MojFilterSelectedComponent,
            MojFilterSelectedTagComponent,
        ],
        templateUrl: './filter-wrapper.component.html',
    })
    export class FilterWrapperComponent extends AbstractFilterComponent {
        @Input({ required: true }) filterData!: [];
        @Output() processedData = this.filteredData();

        tagsCategory = {
            categoryName: 'Tags',
            options: [
            { label: 'Tag A', value: 'tagA', selected: false },
            { label: 'Tag B', value: 'tagB', selected: false },
            // ...
            ] as IFilterOption[],
        };

        coloursCategory = {
            categoryName: 'Colours',
            options: [
            { label: 'Red', value: 'red', selected: false },
            { label: 'Blue', value: 'blue', selected: false },
            // ...
            ] as IFilterOption[],
        };

        override ngOnInit(): void {
            this.abstractData.set(this.filterData);
            this.tags.set([this.tagsCategory, this.coloursCategory]); // Ensure it's set first
            super.ngOnInit();
        }
    }



```
Then In the wrapper HTML element,  you have to create the filter page like this: 

```html
<opal-lib-moj-filter>
  <ng-container header> <opal-lib-moj-filter-header title="Filter"></opal-lib-moj-filter-header></ng-container>
  <ng-container selected>
    <opal-lib-moj-filter-selected (clearFilters)="clearAllFilters()">
      <opal-lib-moj-filter-selected-tag
        [FilterData]="selectedTags()"
        (removeTagClicked)="removeTag($event)"
      ></opal-lib-moj-filter-selected-tag>
     </opal-lib-moj-filter-selected
  ></ng-container>
  <ng-container option>
    <opal-lib-moj-filter-option (applyFilters)="onApplyFilters()">
      <ng-container keyword>
        <opal-lib-moj-filter-option-form-group-keyword
          (keywordChange)="onKeywordChange($event)"
        ></opal-lib-moj-filter-option-form-group-keyword>
      </ng-container>
      <ng-container items>
        <opal-lib-moj-filter-options-form-group-item
          [options]="tagsCategory"
          (changed)="onCategoryCheckboxChange($event)"
        ></opal-lib-moj-filter-options-form-group-item>
        <opal-lib-moj-filter-options-form-group-item
          [options]="coloursCategory"
          (changed)="onCategoryCheckboxChange($event)"
        ></opal-lib-moj-filter-options-form-group-item>
      </ng-container>
    </opal-lib-moj-filter-option>
  </ng-container>
</opal-lib-moj-filter>


In your parent component you need to have the data you will be passing in aswell as a method to capture the filtered data event emitter.


```typescript
    import { FilterWrapperComponent } from './filter-wrapper/filter-wrapper.component';
    .......
    Component config
    .......

    public Data = [
    { id: 1, name: 'Task A', tags: 'tagA', colours: 'red' },
    { id: 2, name: 'Task B', tags: 'tagA', colours: 'blue' },
    { id: 3, name: 'Task C', tags: 'tagB', colours: 'red' },
    { id: 4, name: 'Task D', tags: 'tagB', colours: 'red' },
    { id: 5, name: 'Task E', tags: 'tagB', colours: 'blue' },
    { id: 6, name: 'Task F', tags: 'tagB', colours: 'green' },

     appendFilterData(filteredData: any[]): void {
        console.log('Filtered Data:', filteredData);
    }

```

Then you need to forge them all together with the table wrapping component in the parent html.

```html
    <app-filter-wrapper [filterData]="Data" (abstractFilteredData)="appendFilterData($event)"></app-filter-wrapper>

```

## Inputs

| Input             | Type    | Description                                                    |
| ----------------- | ------- | -------------------------------------------------------------- |
| `filterData`      | `obj`   | the data to be filtered                                        |


## Testing

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
