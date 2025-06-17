import { OnInit, Component, signal, Output, EventEmitter, computed } from '@angular/core';
import { IFilterOption, IFilterSelectedTagGroup } from './interfaces/abstract-filter.interfaces';
import { IFilterTableData } from './interfaces/table-data-interface';

@Component({
  template: '',
})
export abstract class AbstractFilterComponent implements OnInit {
  public abstractTags = signal<IFilterSelectedTagGroup[]>([]);
  public abstractKeyword = signal<string>('');
  public abstractData = signal<IFilterTableData[]>([]);

  @Output() abstractFilteredData = new EventEmitter<IFilterTableData[]>();

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  public ngOnInit(): void {}

  /**
   * Computes and returns an array of categories that have at least one selected filter option.
   *
   * Each object in the returned array includes:
   * - `categoryName`: the name of the category.
   * - `options`: an array of filter options that have been marked as selected.
   *
   * The process involves:
   * 1. Mapping over the list of abstract tags.
   * 2. Filtering each category's options to retain only the selected ones.
   * 3. Excluding any category that ends up with an empty `options` array.
   *
   * @returns An array of objects, each with a `categoryName` and an array of selected `IFilterOption` items.
   */
  public abstractSelectedTags = computed(() =>
    this.abstractTags()
      .map((category) => ({
        categoryName: category.categoryName,
        options: category.options.filter((o: IFilterOption) => o.selected),
      }))
      .filter(
        (category): category is { categoryName: string; options: IFilterOption[] } =>
          !!category && category.options.length > 0,
      ),
  );

  /**
   * Applies selected filters to the dataset.
   *
   * This method performs filtering in two main steps:
   * 1. It aggregates the selected filters across different categories by mapping each category to an object that contains the category name and its array of selected values.
   * 2. It filters the data from abstractData() by ensuring that each item:
   *    - Matches all selected filters for each category. If no option is selected for a category, the filter is ignored.
   *    - Optionally matches a keyword filter based on the item's name property.
   *
   * Finally, the filtered list is updated via the filteredData setter.
   */
  public onApplyFilters(): void {
    const selectedFilters = this.abstractTags().map((category) => ({
      categoryName: category.categoryName,
      selectedValues: category.options.filter((o) => o.selected).map((o) => o.value),
    }));

    const newFilteredData = this.abstractData().filter((item) => {
      const matchesAllCategories = selectedFilters.every((filterCategory) => {
        if (filterCategory.selectedValues.length === 0) return true;
        const itemValue = (item as IFilterTableData)[filterCategory.categoryName.toLowerCase()];
        return filterCategory.selectedValues.includes(itemValue as string | number);
      });

      const keyword = this.matchesKeyword(item, this.abstractKeyword());

      return matchesAllCategories && keyword;
    });

    this.emitFilteredData(newFilteredData);
  }

  /**
   * Checks whether the provided keyword is contained within any string property of the given item.
   *
   * If the keyword is not provided or is an empty string, the function returns true by default.
   * Otherwise, the method converts both the keyword and the item's string properties to lowercase
   * and checks if the keyword is present within any property.
   *
   * @param item - The data item whose properties are checked.
   * @param keyword - The string keyword to search for within the item's properties.
   * @returns True if the keyword is found in at least one string property, or if the keyword is empty; otherwise, false.
   */
  private matchesKeyword(item: IFilterTableData, keyword: string): boolean {
    return keyword
      ? Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase()),
        )
      : true;
  }

  /**
   * Deselects the tag option whose label matches the provided string and updates the list of selected tags.
   *
   * This method iterates over each category and its options. If an option's label matches the
   * given labelToRemove, it is marked as not selected, and then the overall selected tags are updated.
   *
   * @param labelToRemove - The label of the tag to deselect.
   */
  public removeTag(labelToRemove: string): void {
    const updated = this.abstractTags().map((category) => ({
      ...category,
      options: category.options.map((o) => (o.label === labelToRemove ? { ...o, selected: false } : o)),
    }));
    this.abstractTags.set(updated);
  }

  /**
   * Clears all filter selections.
   *
   * This method iterates over each filter category and resets every option's selection state to false.
   * Once all selections are cleared, it calls updateSelectedTags to reflect the changes.
   */
  public clearAllFilters(): void {
    const cleared = this.abstractTags().map((category) => ({
      ...category,
      options: category.options.map((o) => ({ ...o, selected: false })),
    }));
    this.abstractTags.set(cleared);
  }

  /**
   * Handles a change event for a category checkbox by updating the selected state of the corresponding filter option.
   *
   * This method iterates over each category returned by the abstractTags() method and searches for a matching option based on the value of the provided item.
   * If a match is found, the option's selected property is updated to reflect the current state of item.selected.
   * After processing all categories, it calls updateSelectedTags() to refresh the overall tag selection state.
   *
   * @param item - The filter option object containing the updated selection state and option value.
   */
  public onCategoryCheckboxChange(item: IFilterOption): void {
    const updated = this.abstractTags().map((category) => ({
      ...category,
      options: category.options.map((o) => (o.value === item.value ? { ...o, selected: item.selected } : o)),
    }));
    this.abstractTags.set(updated);
  }

  /**
   * Updates the current keyword.
   *
   * This method is invoked when the keyword changes and updates the keyword state accordingly.
   *
   * @param keyword - The new keyword for filtering.
   */
  public onKeywordChange(keyword: string): void {
    this.abstractKeyword.set(keyword);
  }

  /**
   * Emits the provided filtered data array
   * @param data - An array containing the filtered data to be emitted.
   */
  emitFilteredData(data: IFilterTableData[]): void {
    this.abstractFilteredData.emit(data);
  }
}
