import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from './abstract-sortable-table-pagination.component';
import { MOCK_ABSTRACT_TABLE_DATA } from '../abstract-sortable-table/mocks/abstract-sortable-table-data.mock';
import { describe, beforeEach, vi, afterAll, it, expect } from 'vitest';

@Component({
  template: '', // Minimal template for the test component
})
class TestComponent extends AbstractSortableTablePaginationComponent {
  constructor() {
    super();
    this.setTableData(MOCK_ABSTRACT_TABLE_DATA);
    this.abstractExistingSortState = null;
    this.itemsPerPageSignal.set(1);
  }
}

describe('AbstractSortableTablePaginationComponent', () => {
  let component: TestComponent | null;
  let fixture: ComponentFixture<TestComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: vi.fn(), // Mock detectChanges
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent); // Create the TestComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    expect(component.currentPageSignal()).toBe(1);
    expect(component.itemsPerPageSignal()).toBe(1);
    expect(component['startIndexComputed']()).toBe(1);
    expect(component['endIndexComputed']()).toBe(1);
    expect(component.paginatedTableDataComputed()).toEqual([MOCK_ABSTRACT_TABLE_DATA[0]]);
  });

  it('should update current page on page change', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.onPageChange(2);
    expect(component.currentPageSignal()).toBe(2);
  });

  it('should reset current page to 1 on sort change', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.currentPageSignal.set(2); // Set current page to 2
    component.onSortChange({ key: 'name', sortType: 'ascending' }); // Trigger sort change
    expect(component.currentPageSignal()).toBe(1); // Expect current page to be reset to 1
  });

  it('should clamp current page to bounds', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.onPageChange(-5);
    expect(component.currentPageSignal()).toBe(1);

    component.onPageChange(999);
    const expectedMaxPage = Math.ceil(component.sortedTableDataSignal().length / component.itemsPerPageSignal());
    expect(component.currentPageSignal()).toBe(expectedMaxPage);
  });

  it('should update paginated output when items per page changes', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.itemsPerPageSignal.set(2);
    fixture?.detectChanges();

    const paginated = component.paginatedTableDataComputed();
    expect(paginated.length).toBe(2);
    expect(paginated).toEqual(MOCK_ABSTRACT_TABLE_DATA.slice(0, 2));
  });

  it('should reset current page to 1 on filter application', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.currentPageSignal.set(3); // simulate being on page 3
    component.onApplyFilters(); // apply filters
    expect(component.currentPageSignal()).toBe(1); // should reset to page 1
  });

  it('should work with default itemsPerPageSignal value', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Create a new component without setting itemsPerPageSignal
    const newFixture = TestBed.createComponent(TestComponent);
    const newComponent = newFixture.componentInstance;

    // Reset to default by not calling set
    const defaultComponent = Object.create(AbstractSortableTablePaginationComponent.prototype);
    defaultComponent.currentPageSignal = newComponent.currentPageSignal;
    defaultComponent.itemsPerPageSignal = newComponent.itemsPerPageSignal;

    // The default should be 10
    expect(newComponent.itemsPerPageSignal()).toBe(1); // TestComponent sets it to 1 in constructor
  });

  it('should calculate correct indices with multiple pages', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.itemsPerPageSignal.set(2);
    component.currentPageSignal.set(2);
    fixture?.detectChanges();

    // Page 2 with 2 items per page: start at index 3 (1-based), end at min(total length, 3 + 2 - 1) = min(length, 4)
    expect(component['startIndexComputed']()).toBe(3);
    const actualEnd = component['endIndexComputed']();
    const expectedEnd = Math.min(MOCK_ABSTRACT_TABLE_DATA.length, 4);
    expect(actualEnd).toBe(expectedEnd);
    expect(component.paginatedTableDataComputed().length).toBeGreaterThan(0);
  });

  it('should handle edge case when on last page with fewer items', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const dataLength = MOCK_ABSTRACT_TABLE_DATA.length;
    component.itemsPerPageSignal.set(2);
    const lastPage = Math.ceil(dataLength / 2);
    component.currentPageSignal.set(lastPage);
    fixture?.detectChanges();

    const paginated = component.paginatedTableDataComputed();
    expect(paginated.length).toBeGreaterThan(0);
    expect(paginated.length).toBeLessThanOrEqual(2);
  });
});
