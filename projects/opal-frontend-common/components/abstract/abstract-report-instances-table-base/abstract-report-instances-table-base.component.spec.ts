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

  it('should set report table data and use the inherited page size', () => {
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    expect(component.itemsPerPageSignal()).toBe(10);
    expect(component.paginatedTableDataComputed()).toHaveLength(10);
  });

  it('should handle empty report table data', () => {
    component.tableData = [];

    expect(component.paginatedTableDataComputed()).toEqual([]);
  });

  it('should return the second page of report table data', () => {
    const tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));
    component.tableData = tableData;

    component.onPageChange(2);

    expect(component.paginatedTableDataComputed()).toEqual(tableData.slice(10, 20));
  });

  it('should allow consumers to override the inherited page size', () => {
    component.itemsPerPageSignal.set(5);
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    expect(component.itemsPerPageSignal()).toBe(5);
    expect(component.paginatedTableDataComputed()).toHaveLength(5);
  });

  it('should keep the current page valid when the inherited page size changes', () => {
    component.tableData = Array.from({ length: 26 }, (_, index) => ({
      Title: `Report ${index + 1}`,
      instanceId: `${index + 1}`,
    }));

    component.onPageChange(3);
    component.itemsPerPageSignal.set(25);

    expect(component.currentPageSignal()).toBe(2);
    expect(component.paginatedTableDataComputed()).toHaveLength(1);
  });
});
