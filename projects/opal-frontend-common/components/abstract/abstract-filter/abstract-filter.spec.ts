import { Component } from '@angular/core';
import { AbstractFilterComponent } from './abstract-filter';

@Component({ template: '' })
class TestFilterComponent extends AbstractFilterComponent {}

describe('AbstractFilterComponent', () => {
  let component: TestFilterComponent;

  beforeEach(() => {
    component = new TestFilterComponent();
  });

  it('should initialize signals with default values', () => {
    expect(component.abstractTags()).toEqual([]);
    expect(component.abstractKeyword()).toBe('');
    expect(component.abstractData()).toEqual([]);
    expect(component.abstractSelectedTags()).toEqual([]);
  });

  it('should update selected tags correctly', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [
          { label: 'Urgent', value: 'urgent', selected: true, count: 4 },
          { label: 'Normal', value: 'normal', selected: false, count: 2 },
        ],
      },
    ]);
    component.updateSelectedTags();
    expect(component.abstractSelectedTags()).toEqual([
      {
        categoryName: 'Tags',
        options: [{ label: 'Urgent', value: 'urgent', selected: true, count: 4 }],
      },
    ]);
  });

  it('should apply filters correctly with keyword', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [{ label: 'Urgent', value: 'urgent', selected: true, count: 4 }],
      },
    ]);
    component.abstractData.set([
      { name: 'Fix login bug', tags: 'urgent' },
      { name: 'Review PR', tags: 'normal' },
    ]);
    component.abstractKeyword.set('login');

    const emitSpy = spyOn(component.abstractFilteredData, 'emit');
    component.onApplyFilters();

    expect(emitSpy).toHaveBeenCalledWith([{ name: 'Fix login bug', tags: 'urgent' }]);
  });

  it('should apply filters correctly without keyword', () => {
    component.abstractTags.set([
      {
        categoryName: 'Status',
        options: [{ label: 'Open', value: 'open', selected: true, count: 10 }],
      },
    ]);
    component.abstractData.set([
      { name: 'Issue 1', status: 'open' },
      { name: 'Issue 2', status: 'closed' },
    ]);
    component.abstractKeyword.set('');

    const emitSpy = spyOn(component.abstractFilteredData, 'emit');
    component.onApplyFilters();

    expect(emitSpy).toHaveBeenCalledWith([{ name: 'Issue 1', status: 'open' }]);
  });

  it('should remove a selected tag by label', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [
          { label: 'Urgent', value: 'urgent', selected: true, count: 4 },
          { label: 'Optional', value: 'optional', selected: true, count: 1 },
        ],
      },
    ]);
    component.removeTag('Urgent');
    const options = component.abstractTags()[0].options;
    expect(options.find((o) => o.label === 'Urgent')?.selected).toBeFalse();
  });

  it('should clear all selected filters', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [
          { label: 'Urgent', value: 'urgent', selected: true, count: 4 },
          { label: 'Optional', value: 'optional', selected: true, count: 1 },
        ],
      },
    ]);
    component.clearAllFilters();
    const allDeselected = component.abstractTags()[0].options.every((o) => !o.selected);
    expect(allDeselected).toBeTrue();
  });

  it('should update category checkbox selection state', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [{ label: 'Urgent', value: 'urgent', selected: false, count: 4 }],
      },
    ]);
    component.onCategoryCheckboxChange({ label: 'Urgent', value: 'urgent', selected: true, count: 4 });
    const updated = component.abstractTags()[0].options.find((o) => o.value === 'urgent');
    expect(updated?.selected).toBeTrue();
  });

  it('should update the keyword', () => {
    component.onKeywordChange('search term');
    expect(component.abstractKeyword()).toBe('search term');
  });

  it('should emit filtered data and call preventDefault if event is provided', () => {
    const testEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
    const emitSpy = spyOn(component.abstractFilteredData, 'emit');
    component.emitFilteredData([{ sample: 123 }], testEvent);
    expect(testEvent.preventDefault).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([{ sample: 123 }]);
  });

  it('should call updateSelectedTags on initialization', () => {
    const updateSpy = spyOn(component, 'updateSelectedTags').and.callThrough();
    component.ngOnInit();
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should initialize abstractSelectedTags to an empty array on initialization', () => {
    component.abstractTags.set([]); // ensure no tags exist
    component.ngOnInit();
    expect(component.abstractSelectedTags()).toEqual([]);
  });
  it('should filter data matching all selected category filters across multiple categories', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [
          { label: 'Urgent', value: 'urgent', selected: true, count: 4 },
          { label: 'Normal', value: 'normal', selected: false, count: 2 },
        ],
      },
      {
        categoryName: 'Status',
        options: [
          { label: 'Open', value: 'open', selected: true, count: 10 },
          { label: 'Closed', value: 'closed', selected: false, count: 3 },
        ],
      },
    ]);
    component.abstractData.set([
      { name: 'Task 1', tags: 'urgent', status: 'open' },
      { name: 'Task 2', tags: 'urgent', status: 'closed' },
      { name: 'Task 3', tags: 'normal', status: 'open' },
      { name: 'Task 4', tags: 'normal', status: 'closed' },
    ]);
    component.abstractKeyword.set('');
    const emitSpy = spyOn(component.abstractFilteredData, 'emit');
    component.onApplyFilters();
    expect(emitSpy).toHaveBeenCalledWith([{ name: 'Task 1', tags: 'urgent', status: 'open' }]);
  });

  it('should return items when a category has no selected filters (ignoring that category)', () => {
    component.abstractTags.set([
      {
        categoryName: 'Tags',
        options: [
          { label: 'Urgent', value: 'urgent', selected: false, count: 4 },
          { label: 'Normal', value: 'normal', selected: false, count: 2 },
        ],
      },
      {
        categoryName: 'Status',
        options: [
          { label: 'Open', value: 'open', selected: true, count: 10 },
          { label: 'Closed', value: 'closed', selected: false, count: 3 },
        ],
      },
    ]);
    component.abstractData.set([
      { name: 'Task 1', tags: 'urgent', status: 'open' },
      { name: 'Task 2', tags: 'normal', status: 'open' },
      { name: 'Task 3', tags: 'urgent', status: 'closed' },
      { name: 'Task 4', tags: 'normal', status: 'closed' },
    ]);
    component.abstractKeyword.set('');
    const emitSpy = spyOn(component.abstractFilteredData, 'emit');
    component.onApplyFilters();
    expect(emitSpy).toHaveBeenCalledWith([
      { name: 'Task 1', tags: 'urgent', status: 'open' },
      { name: 'Task 2', tags: 'normal', status: 'open' },
    ]);
  });
});
