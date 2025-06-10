import { OnInit, Component, signal, Output, EventEmitter } from '@angular/core';
import { IFilterCategory, IFilterOption } from './interfaces/filter-interfaces';
import { IFilterTableData } from './interfaces/table-data-interface';

@Component({
  template: '',
})
export abstract class AbstractFilterComponent implements OnInit {
  public abstractTags = signal<IFilterCategory[]>([]);
  public abstractKeyword = signal<string>('');
  public abstractData = signal<IFilterTableData[]>([]);
  public abstractSelectedTags = signal<Array<{ categoryName: string; options: IFilterOption[] }>>([]);

  @Output() abstractFilteredData = new EventEmitter<IFilterTableData[]>();

  ngOnInit(): void {
    this.updateSelectedTags();
  }

  /**
   * Updates the tag selection by filtering and mapping the current filter options.
   *
   * This method iterates through each filter category, retaining only those options that are
   * currently selected. It then excludes any categories that do not have at least one selected option,
   * updating the selectedTags state accordingly.
   */
  public updateSelectedTags(): void {
    this.abstractSelectedTags.set(
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
  }

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

      const keyword = this.abstractKeyword();
      const matchesKeyword = keyword
        ? Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase()),
          )
        : true;

      return matchesAllCategories && matchesKeyword;
    });

    this.emitFilteredData(newFilteredData);
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
    this.abstractTags().forEach((category) => {
      category.options.forEach((o) => {
        if (o.label === labelToRemove) {
          o.selected = false;
        }
      });
    });

    this.updateSelectedTags();
  }

  /**
   * Clears all filter selections.
   *
   * This method iterates over each filter category and resets every option's selection state to false.
   * Once all selections are cleared, it calls updateSelectedTags to reflect the changes.
   */
  public clearAllFilters(): void {
    this.abstractTags().forEach((category) => {
      category.options.forEach((o) => (o.selected = false));
    });

    this.updateSelectedTags();
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
    this.abstractTags().forEach((category) => {
      const option = category.options.find((o) => o.value === item.value);
      if (option) {
        option.selected = item.selected;
      }
    });

    this.updateSelectedTags();
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
   * Emits the provided filtered data array and optionally prevents the default behavior of the specified event.
   *
   * @param data - An array containing the filtered data to be emitted.
   * @param event - (Optional) An event whose default behavior will be prevented if provided.
   */
  emitFilteredData(data: IFilterTableData[], event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.abstractFilteredData.emit(data);
  }
}
