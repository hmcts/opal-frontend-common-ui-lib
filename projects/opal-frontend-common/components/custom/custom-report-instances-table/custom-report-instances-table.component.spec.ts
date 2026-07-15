import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { CustomReportInstancesTableComponent } from './custom-report-instances-table.component';
import { ICustomReportInstancesTableData } from './interfaces/custom-report-instances-table-data.interface';

describe('CustomReportInstancesTableComponent', () => {
  let component: CustomReportInstancesTableComponent;
  let fixture: ComponentFixture<CustomReportInstancesTableComponent>;

  const tableData: ICustomReportInstancesTableData[] = [
    {
      'Date and time': 1718007300000,
      Title: 'Report A',
      'Business unit': 'Business unit A',
      'Created by': 'User A',
      Status: 'Ready',
      instanceId: '1',
      dateTimeDisplay: '10 Jun 2024 at 09:15',
      isActionable: true,
      actionLabels: 'CSV,PDF',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomReportInstancesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomReportInstancesTableComponent);
    component = fixture.componentInstance;
    component.tableData = tableData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render report instance rows and action labels', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('10 Jun 2024 at 09:15');
    expect(text).toContain('Report A');
    expect(text).toContain('Business unit A');
    expect(text).toContain('User A');
    expect(text).toContain('Ready');
    expect(text).toContain('CSV');
    expect(text).toContain('PDF');
  });

  it('should render unique table cell ids', () => {
    expect(fixture.nativeElement.querySelector('#reportInstanceDateTime-0')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#reportInstanceTitle-0')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#reportInstanceAction-0')).toBeTruthy();
  });

  it('should emit the selected report instance and prevent default navigation', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    const emitSpy = vi.spyOn(component.instanceSelected, 'emit');

    component.onInstanceSelected(event, tableData[0]);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(tableData[0]);
  });

  it('should emit the selected action and prevent default navigation', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    const emitSpy = vi.spyOn(component.actionSelected, 'emit');

    component.onActionSelected(event, tableData[0], 'CSV');

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith({ row: tableData[0], actionLabel: 'CSV' });
  });
});
