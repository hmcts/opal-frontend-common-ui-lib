import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, expect, it } from 'vitest';
import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { AbstractReportInstancesTableBaseComponent } from './abstract-report-instances-table-base.component';

interface TestReportInstancesTableData extends IAbstractTableData<SortableValuesType> {
  Title: string;
  instanceId: string;
}

@Component({ template: '' })
class TestReportInstancesTableBaseComponent extends AbstractReportInstancesTableBaseComponent<TestReportInstancesTableData> {}

describe('AbstractReportInstancesTableBaseComponent', () => {
  let component: TestReportInstancesTableBaseComponent;
  let fixture: ComponentFixture<TestReportInstancesTableBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReportInstancesTableBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportInstancesTableBaseComponent);
    component = fixture.componentInstance;
  });

  it('should set report table data and use the report page size', () => {
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    expect(component.itemsPerPageSignal()).toBe(25);
    expect(component.paginatedTableDataComputed()).toHaveLength(25);
  });

  it('should handle empty report table data', () => {
    component.tableData = [];

    expect(component.paginatedTableDataComputed()).toEqual([]);
  });

  it('should return the second page of report table data', () => {
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    component.onPageChange(2);

    expect(component.paginatedTableDataComputed()).toEqual([{ Title: 'Report 26', instanceId: '26' }]);
  });

  it('should allow consumers to override the report page size', () => {
    component.itemsPerPage = 10;
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    expect(component.itemsPerPageSignal()).toBe(10);
    expect(component.paginatedTableDataComputed()).toHaveLength(10);
  });

  it('should update paginated report table data when page size changes after data is set', () => {
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    component.itemsPerPage = 5;

    expect(component.itemsPerPageSignal()).toBe(5);
    expect(component.paginatedTableDataComputed()).toHaveLength(5);
  });
});
