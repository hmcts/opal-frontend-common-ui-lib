import { Component } from '@angular/core';
import { AbstractFilterComponent } from './abstract-filter';
import { IFilterOption, IFilterSelectedTagGroup } from './interfaces/abstract-filter.interfaces';
import { IFilterTableData } from './interfaces/table-data-interface';

@Component({ template: '' })
class TestFilterComponent extends AbstractFilterComponent {}

describe('AbstractFilterComponent', () => {
  let component: TestFilterComponent;

  beforeEach(() => {
    component = new TestFilterComponent();
  });

  it('should compute selected tags correctly', () => {
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Status',
        options: [
          { label: 'Active', value: 'active', count: 0, selected: true },
          { label: 'Inactive', value: 'inactive', count: 0, selected: false },
        ],
      },
      {
        categoryName: 'Type',
        options: [
          { label: 'Admin', value: 'admin', count: 0, selected: false },
          { label: 'User', value: 'user', count: 0, selected: true },
        ],
      },
    ];
    component.abstractTags.set(mockTags);

    const selectedTags = component.abstractSelectedTags();
    expect(selectedTags.length).toBe(2);
    expect(selectedTags[0].options.length).toBe(1);
    expect(selectedTags[0].options[0].label).toBe('Active');
    expect(selectedTags[1].options.length).toBe(1);
    expect(selectedTags[1].options[0].label).toBe('User');
  });

  it('should remove a tag by label correctly', () => {
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Status',
        options: [
          { label: 'Active', value: 'active', count: 0, selected: true },
          { label: 'Inactive', value: 'inactive', count: 0, selected: true },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    component.removeTag('Active');
    const updatedTags = component.abstractTags();
    const activeOption = updatedTags[0].options.find((o) => o.label === 'Active');
    const inactiveOption = updatedTags[0].options.find((o) => o.label === 'Inactive');
    expect(activeOption?.selected).toBeFalse();
    expect(inactiveOption?.selected).toBeTrue();
  });

  it('should clear all filter selections', () => {
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Status',
        options: [
          { label: 'Active', value: 'active', count: 0, selected: true },
          { label: 'Inactive', value: 'inactive', count: 0, selected: true },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    component.clearAllFilters();
    const clearedTags = component.abstractTags();
    clearedTags[0].options.forEach((option) => {
      expect(option.selected).toBeFalse();
    });
  });

  it('should update the category checkbox selection correctly', () => {
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Role',
        options: [
          { label: 'Admin', value: 'admin', count: 0, selected: false },
          { label: 'User', value: 'user', count: 0, selected: false },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    const updatedOption: IFilterOption = { label: 'User', value: 'user', count: 0, selected: true };
    component.onCategoryCheckboxChange(updatedOption);

    const updatedTags = component.abstractTags();
    const adminOption = updatedTags[0].options.find((o) => o.label === 'Admin');
    const userOption = updatedTags[0].options.find((o) => o.label === 'User');
    expect(adminOption?.selected).toBeFalse();
    expect(userOption?.selected).toBeTrue();
  });

  it('should update the keyword correctly', () => {
    component.onKeywordChange('test keyword');
    expect(component.abstractKeyword()).toBe('test keyword');
  });

  it('should filter data and emit filtered results based on selected tags and keyword', () => {
    // Setup filter: only "Active" is selected in the Status category.
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Status',
        options: [
          { label: 'Active', value: 'active', count: 0, selected: true },
          { label: 'Inactive', value: 'inactive', count: 0, selected: false },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    // Setup table data with a "status" field.
    const data: IFilterTableData[] = [
      { status: 'active', name: 'Item 1' },
      { status: 'inactive', name: 'Item 2' },
    ];
    component.abstractData.set(data);
    component.onKeywordChange('Item');

    let emittedData: IFilterTableData[] | undefined;
    component.abstractFilteredData.subscribe((result: IFilterTableData[]) => {
      emittedData = result;
    });

    component.onApplyFilters();
    expect(emittedData).toBeDefined();
    // Only the first item should pass the "active" filter.
    expect(emittedData!.length).toBe(1);
    expect(emittedData![0]['status']).toBe('active');
  });

  it('should emit all items when no filter is selected', () => {
    // No tag selection, so all items should pass.
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Status',
        options: [
          { label: 'Active', value: 'active', count: 0, selected: false },
          { label: 'Inactive', value: 'inactive', count: 0, selected: false },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    const data: IFilterTableData[] = [
      { status: 'active', name: 'Item 1' },
      { status: 'inactive', name: 'Item 2' },
    ];
    component.abstractData.set(data);
    component.onKeywordChange(''); // no keyword filter

    let emittedData: IFilterTableData[] | undefined;
    component.abstractFilteredData.subscribe((result: IFilterTableData[]) => {
      emittedData = result;
    });

    component.onApplyFilters();
    expect(emittedData!.length).toBe(2);
  });

  it('should filter data by keyword when no tag filtering is applied', () => {
    // Setup filter categories with no selection.
    const mockTags: IFilterSelectedTagGroup[] = [
      {
        categoryName: 'Category',
        options: [
          { label: 'Option1', value: 'value1', count: 0, selected: false },
          { label: 'Option2', value: 'value2', count: 0, selected: false },
        ],
      },
    ];
    component.abstractTags.set(mockTags);
    // Setup table data with a "name" field to match keyword.
    const data: IFilterTableData[] = [
      { category: 'value1', name: 'Alpha' },
      { category: 'value2', name: 'Beta' },
      { category: 'value1', name: 'Gamma' },
    ];
    component.abstractData.set(data);
    component.onKeywordChange('be'); // should match "Beta"

    let emittedData: IFilterTableData[] | undefined;
    component.abstractFilteredData.subscribe((result: IFilterTableData[]) => {
      emittedData = result;
    });

    component.onApplyFilters();
    expect(emittedData!.length).toBe(1);
    expect(emittedData![0]['name']).toBe('Beta');
  });
});
