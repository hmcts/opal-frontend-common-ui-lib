import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AbstractTableFilterComponent } from './abstract-table-filter.component';
import {
  IAbstractTableData,
  IAbstractTableFilterCategory,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/types';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  selector: 'opal-lib-test-concrete-filter',
  template: '',
  standalone: true,
})
class TestFilterComponent extends AbstractTableFilterComponent {}

describe('AbstractTableFilterComponent', () => {
  let component: TestFilterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestFilterComponent],
    });

    const fixture = TestBed.createComponent(TestFilterComponent);
    component = fixture.componentInstance;
  });

  it('should apply tag filter and emit filtered data', () => {
    const data: IAbstractTableData<SortableValuesType>[] = [
      { id: 1, status: 'Open' },
      { id: 2, status: 'Closed' },
    ];
    const tags: IAbstractTableFilterCategory[] = [
      {
        categoryName: 'status',
        options: [
          { label: 'Open', value: 'Open', selected: true },
          { label: 'Closed', value: 'Closed', selected: false },
        ],
      },
    ];

    component.setTableData(data);
    component.filterTags.set(tags);
    component.onApplyFilters();

    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(1);
    expect(result[0]['status']).toBe('Open');
  });

  it('should apply keyword filter', () => {
    const data: IAbstractTableData<SortableValuesType>[] = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    component.setTableData(data);
    component.keyword.set('alice');
    component.onApplyFilters();

    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(1);
    expect(result[0]['name']).toBe('Alice');
  });

  it('should clear all filters', () => {
    const data: IAbstractTableData<SortableValuesType>[] = [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ];
    const tags: IAbstractTableFilterCategory[] = [
      {
        categoryName: 'Type',
        options: [
          { label: 'One', value: 'One', selected: true },
          { label: 'Two', value: 'Two', selected: false },
        ],
      },
    ];

    component.setTableData(data);
    component.filterTags.set(tags);
    component.keyword.set('One');
    component.onApplyFilters();

    component.clearAllFilters();

    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(2);
  });

  it('should update keyword using onKeywordChange and apply filter', () => {
    const data = [
      { id: 1, title: 'Case A' },
      { id: 2, title: 'Case B' },
    ];
    component.setTableData(data);
    component.onKeywordChange('case b');
    component.onApplyFilters();
    expect(component.filteredTableDataSignal().length).toBe(1);
    expect(component.filteredTableDataSignal()[0]['title']).toBe('Case B');
  });

  it('should update checkbox selection and filter data', () => {
    const data = [
      { id: 1, type: 'Civil' },
      { id: 2, type: 'Criminal' },
    ];
    const tags = [
      {
        categoryName: 'type',
        options: [
          { label: 'Civil', value: 'Civil', selected: false },
          { label: 'Criminal', value: 'Criminal', selected: false },
        ],
      },
    ];

    component.setTableData(data);
    component.filterTags.set(tags);
    component.onCategoryCheckboxChange('type', 'Civil', true);
    component.onApplyFilters();
    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(1);
    expect(result[0]['type']).toBe('Civil');
  });

  it('should deselect tag and re-apply filters', () => {
    const data = [
      { id: 1, tag: 'Urgent' },
      { id: 2, tag: 'Normal' },
    ];
    const tags = [
      {
        categoryName: 'tag',
        options: [
          { label: 'Urgent', value: 'Urgent', selected: true },
          { label: 'Normal', value: 'Normal', selected: true },
        ],
      },
    ];

    component.setTableData(data);
    component.filterTags.set(tags);
    component.onApplyFilters();
    expect(component.filteredTableDataSignal().length).toBe(2);

    component.removeTag('tag', 'Urgent');
    component.onApplyFilters();

    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(1);
    expect(result[0]['tag']).toBe('Normal');
  });

  it('should return selected tag groups from abstractSelectedTags', () => {
    const tags = [
      {
        categoryName: 'type',
        options: [
          { label: 'X', value: 'X', selected: false },
          { label: 'Y', value: 'Y', selected: true },
        ],
      },
      {
        categoryName: 'level',
        options: [{ label: 'High', value: 'High', selected: true }],
      },
    ];

    component.filterTags.set(tags);
    const selected = component.abstractSelectedTags();
    expect(selected.length).toBe(2);
    expect(selected[0].options.length).toBe(1);
    expect(selected[1].categoryName).toBe('level');
  });

  it('should reset filters with default keyword', () => {
    const data = [
      { id: 1, tag: 'A' },
      { id: 2, tag: 'B' },
    ];
    const tags = [
      {
        categoryName: 'tag',
        options: [
          { label: 'A', value: 'A', selected: true },
          { label: 'B', value: 'B', selected: false },
        ],
      },
    ];

    component.setTableData(data);
    component.resetFiltersTo(tags);
    const result = component.filteredTableDataSignal();
    expect(result.length).toBe(1);
    expect(result[0]['tag']).toBe('A');
  });

  it('should leave other categories untouched when toggling one', () => {
    const tags = [
      {
        categoryName: 'tag',
        options: [{ label: 'X', value: 'X', selected: false }],
      },
      {
        categoryName: 'type',
        options: [{ label: 'A', value: 'A', selected: false }],
      },
    ];

    component.filterTags.set(tags);
    component.onCategoryCheckboxChange('tag', 'X', true);

    const result = component.filterTags();
    expect(result.find((g) => g.categoryName === 'type')?.options[0].selected).toBe(false);
  });

  it('should return only selected options from getSelectedOptionsFromTags()', () => {
    const allTags: IAbstractTableFilterCategory[] = [
      {
        categoryName: 'status',
        options: [
          { label: 'Open', value: 'open', selected: true },
          { label: 'Closed', value: 'closed', selected: false },
        ],
      },
      {
        categoryName: 'type',
        options: [
          { label: 'A', value: 'a', selected: true },
          { label: 'B', value: 'b', selected: true },
        ],
      },
    ];

    const result = component['getSelectedOptionsFromTags'](allTags);
    expect(result.length).toBe(2);
    expect(result[0].categoryName).toBe('status');
    expect(result[0].options.length).toBe(1);
    expect(result[0].options[0].value).toBe('open');
    expect(result[1].categoryName).toBe('type');
    expect(result[1].options.length).toBe(2);
  });
});
