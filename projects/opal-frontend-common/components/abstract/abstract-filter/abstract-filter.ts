import { OnInit, Component, signal } from '@angular/core';
import {
  IFilterCategory,
  IFilterOption,
} from 'projects/opal-frontend-common/components/moj/moj-filter/interfaces/filter-interfaces';

@Component({
  template: '',
})
export abstract class AbstractFilterComponent implements OnInit {
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

  tags: IFilterCategory[] = [this.tagsCategory, this.coloursCategory]; // Array of categories to show in the checkboxes

  // 2) The array of selected filters that we display in <app-moj-filter-selected-tag>
  selectedTags: Array<{ categoryName: string; options: IFilterOption[] }> = [];
  keyword: string = ''; // Store the entered keyword

  // Possibly the original data set that you want to filter:
  originalData = [
    { id: 1, name: 'Item 1', color: 'red', tag: 'tagA' },
    { id: 2, name: 'Item 2', color: 'blue', tag: 'tagA' },
    { id: 3, name: 'Item 3', color: 'red', tag: 'tagB' },
    { id: 4, name: 'Item 4', color: 'blue', tag: 'tagC' },
    { id: 5, name: 'Item 5', color: 'green', tag: 'tagC' },
    { id: 6, name: 'Item 6', color: 'red', tag: 'tagA' },
    { id: 7, name: 'Item 7', color: 'green', tag: 'tagB' },
    { id: 8, name: 'Item 8', color: 'blue', tag: 'tagB' },
    { id: 9, name: 'Item 9', color: 'green', tag: 'tagA' },
    { id: 10, name: 'Item 10', color: 'red', tag: 'tagC' },
  ];
  filteredData = [{}];

  ngOnInit(): void {
    this.updateSelectedTags();
  }

  updateSelectedTags(): void {
    this.selectedTags = this.tags
      .map((category) => ({
        categoryName: category.categoryName,
        options: category.options.filter((o: IFilterOption) => o.selected),
      }))
      .filter((category) => category.options.length > 0);

    this.onApplyFilters();
  }

  onApplyFilters(): void {
    const selectedTags = this.tagsCategory.options.filter((o) => o.selected).map((o) => o.value);
    const selectedColours = this.coloursCategory.options.filter((o) => o.selected).map((o) => o.value);

    this.filteredData = this.originalData.filter((item) => {
      const matchesTags = selectedTags.length ? selectedTags.includes(item.tag) : true;
      const matchesColours = selectedColours.length ? selectedColours.includes(item.color) : true;
      const matchesKeyword = this.keyword ? item.name.toLowerCase().includes(this.keyword.toLowerCase()) : true;

      return matchesTags && matchesColours && matchesKeyword;
    });

    console.log('Filtered Data:', this.filteredData);
  }

  removeTag(labelToRemove: string) {
    this.tagsCategory.options.forEach((o) => {
      if (o.label === labelToRemove) {
        o.selected = false;
      }
    });
    this.coloursCategory.options.forEach((o) => {
      if (o.label === labelToRemove) {
        o.selected = false;
      }
    });

    this.updateSelectedTags();
  }

  clearAllFilters(): void {
    this.tagsCategory.options.forEach((o) => (o.selected = false));
    this.coloursCategory.options.forEach((o) => (o.selected = false));

    this.updateSelectedTags();
  }
  onCategoryCheckboxChange(item: IFilterOption): void {
    const category = [this.tagsCategory, this.coloursCategory].find((cat) =>
      cat.options.some((o) => o.value === item.value),
    );

    if (category) {
      const option = category.options.find((o) => o.value === item.value);
      if (option) {
        option.selected = item.selected;
      }
    }
    this.updateSelectedTags();
  }
  onKeywordChange(keyword: string): void {
    this.keyword = keyword;
  }
}
