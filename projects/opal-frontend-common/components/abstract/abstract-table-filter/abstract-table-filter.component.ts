import { Component, signal, computed, Signal } from '@angular/core';
import {
  IAbstractTableData,
  IAbstractTableFilterCategory,
  IAbstractTableFilterOption,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/types';

@Component({ template: '' })
export abstract class AbstractTableFilterComponent {
  public displayTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
  public filteredTableDataSignal = signal<IAbstractTableData<SortableValuesType>[]>([]);
  public filterTags = signal<IAbstractTableFilterCategory[]>([]);
  public keyword = signal<string>('');
  public appliedFilterTags = signal<IAbstractTableFilterCategory[]>([]);
  public appliedKeyword = signal<string>('');

  /**
   * Determines whether a given item matches a specific filter option within a category.
   * @param item The data item to test.
   * @param categoryName The category name to check within the item.
   * @param option The filter option to match against.
   * @returns True if the item's value for the category matches the option's value; otherwise false.
   */
  protected matchItemWithFilterOption(
    item: IAbstractTableData<SortableValuesType>,
    categoryName: string,
    option: IAbstractTableFilterOption,
  ): boolean {
    return item?.[categoryName] === option.value;
  }

  /**
   * Determines whether a given item matches the keyword filter.
   * Checks if any value in the item contains the keyword (case-insensitive).
   * @param item The data item to test.
   * @param keyword The keyword to match against.
   * @returns True if any value in the item contains the keyword; otherwise false.
   */
  protected matchItemWithKeyword(item: IAbstractTableData<SortableValuesType>, keyword: string): boolean {
    return Object.values(item).some((value) => value?.toString().toLowerCase().includes(keyword));
  }

  /**
   * Extracts and returns categories from the provided tags that have at least one selected option.
   *
   * For each category in the input array, this method filters its options to include only those marked as selected.
   * Only categories with at least one selected option are included in the returned array.
   *
   * @param tags - An array of category objects, each containing a list of options.
   * @returns An array of category objects, each with only the selected options, and only categories with at least one selected option.
   */
  protected getSelectedOptionsFromTags(tags: IAbstractTableFilterCategory[]): IAbstractTableFilterCategory[] {
    return tags
      .map((group) => ({
        categoryName: group.categoryName,
        options: group.options.filter((option) => option.selected),
      }))
      .filter((group) => group.options.length > 0);
  }

  /**
   * A computed signal that returns the currently selected filter tags.
   * It filters the filterTags signal to include only those options that are selected,
   * grouped by their category name.
   *
   * @returns An array of filter categories each containing only the selected options.
   */
  public abstractSelectedTags: Signal<IAbstractTableFilterCategory[]> = computed(() =>
    this.getSelectedOptionsFromTags(this.filterTags()),
  );

  /**
   * Updates the keyword used to filter the table data.
   * @param newKeyword The new keyword string to filter by.
   */
  public onKeywordChange(newKeyword: string): void {
    this.keyword.set(newKeyword);
  }

  /**
   * Updates the selection state of a filter option within a category.
   * @param categoryName The name of the filter category.
   * @param optionValue The value of the filter option to update.
   * @param selected Whether the option is selected (true) or deselected (false).
   */
  public onCategoryCheckboxChange(categoryName: string, optionValue: string | number, selected: boolean): void {
    const updatedFilterTags = this.filterTags().map((group) => {
      if (group.categoryName === categoryName) {
        return {
          ...group,
          options: group.options.map((option) => (option.value === optionValue ? { ...option, selected } : option)),
        };
      }
      return group;
    });
    this.filterTags.set(updatedFilterTags);
  }

  /**
   * Removes a selected filter tag by deselecting the corresponding filter option.
   * @param categoryName The name of the filter category.
   * @param optionValue The value of the filter option to remove.
   */
  public removeTag(categoryName: string, optionValue: string | number): void {
    this.onCategoryCheckboxChange(categoryName, optionValue, false);
  }

  /**
   * Clears all applied filters and resets the filter state.
   *
   * This method performs the following actions:
   * - Resets the keyword and applied keyword to empty strings.
   * - Iterates through all filter tag groups and sets each option's `selected` property to `false`.
   * - Updates both the current and applied filter tags with the cleared state.
   * - Applies the updated filter state.
   */
  public clearAllFilters(): void {
    this.keyword.set('');
    this.appliedKeyword.set('');

    const clearedFilterTags = this.filterTags().map((group) => ({
      ...group,
      options: group.options.map((option) => ({ ...option, selected: false })),
    }));

    this.filterTags.set(clearedFilterTags);
    this.appliedFilterTags.set(clearedFilterTags);

    this.applyFilterState();
  }

  /**
   * Initializes and updates the filtered table data based on the currently applied keyword and filter tags.
   *
   * This method performs the following steps:
   * 1. Retrieves the current table data, applied keyword, and filter tags.
   * 2. If filter tags are present, filters the data to include only items that match all selected filter options.
   * 3. If a keyword is present, further filters the data to include only items that match the keyword.
   * 4. Updates the filtered table data signal with the resulting filtered data.
   *
   * @remarks
   * - Filtering by tags requires each item to match every group of filter tags.
   * - Filtering by keyword is case-insensitive and trims whitespace.
   */
  public applyFilterState(): void {
    const data = this.displayTableDataSignal();
    const keyword = this.appliedKeyword().toLowerCase().trim();
    const tags = this.appliedFilterTags();

    const selectedTagGroups = this.getSelectedOptionsFromTags(tags);

    let filtered = data;

    if (selectedTagGroups.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTagGroups.every((group) =>
          group.options.some((option) => this.matchItemWithFilterOption(item, group.categoryName, option)),
        ),
      );
    }

    if (keyword) {
      filtered = filtered.filter((item) => this.matchItemWithKeyword(item, keyword));
    }

    this.filteredTableDataSignal.set(filtered);
  }

  /**
   * Applies the current filter tags and keyword to the table data.
   *
   * This method updates the `appliedFilterTags` and `appliedKeyword` properties
   * with the current filter values, then re-initialises the filtered data set
   * by invoking `applyFilterState()`.
   *
   * Typically called when the user confirms or applies filter changes in the UI.
   */
  public onApplyFilters(): void {
    this.appliedFilterTags.set(this.filterTags());
    this.appliedKeyword.set(this.keyword());
    this.applyFilterState();
  }

  /**
   * Sets the data to be displayed in the table.
   *
   * @param data - An array of table data objects conforming to the `IAbstractTableData<SortableValuesType>` interface.
   */
  public setTableData(data: IAbstractTableData<SortableValuesType>[]): void {
    this.displayTableDataSignal.set(data);
  }

  /**
   * Resets the filter and keyword state to the provided values and reapplies them.
   *
   * @param tags - The filter tag state to apply (including selected values).
   * @param keyword - The keyword string to apply (optional, defaults to empty).
   */
  public resetFiltersTo(tags: IAbstractTableFilterCategory[], keyword: string = ''): void {
    this.filterTags.set(tags);
    this.keyword.set(keyword);
    this.appliedFilterTags.set(tags);
    this.appliedKeyword.set(keyword);
    this.applyFilterState();
  }
}
