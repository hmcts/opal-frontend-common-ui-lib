import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './common/custom-file-interface-viewer-inbound-table-wrapper/custom-file-interface-viewer-inbound-table-wrapper.component';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import { CustomInboundFileViewerComponent } from './custom-inbound-file-viewer.component';

function row(
  overrides: Partial<ICustomFileInterfaceViewerInboundTableWrapperTableData> = {},
): ICustomFileInterfaceViewerInboundTableWrapperTableData {
  return {
    'File ID': 1001,
    'Date and time': 1792497600000,
    dateTimeDisplay: '20 Oct 2026 at 13:00',
    Title: 'original.dat',
    Type: 'RAW',
    'Business unit': 'Camberwell Green',
    Source: 'Allpay',
    Status: 'Ready',
    Actions: null,
    ...overrides,
  };
}

@Component({
  selector: 'opal-lib-inbound-viewer-test-host',
  imports: [CustomInboundFileViewerComponent],
  template: `
    <ng-template #fileAction let-file>
      @if (downloadableIds.has(file['File ID'])) {
        <button type="button" [id]="'consumer-action-' + file['File ID']" (click)="requestDownload(file)">
          Retrieve {{ file.Title }}
        </button>
      }
    </ng-template>
    <opal-lib-custom-inbound-file-viewer
      [businessUnits]="[]"
      [source]="[]"
      [sourceList]="[]"
      [tableData]="rows"
      [actionTemplate]="fileAction"
    ></opal-lib-custom-inbound-file-viewer>
  `,
})
class InboundViewerTestHostComponent {
  public rows: ICustomFileInterfaceViewerInboundTableWrapperTableData[] = [];
  public downloadableIds = new Set<number>();
  public requestDownload = vi.fn();
}

describe('CustomInboundFileViewerComponent', () => {
  let fixture: ComponentFixture<CustomInboundFileViewerComponent>;
  let component: CustomInboundFileViewerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInboundFileViewerComponent, InboundViewerTestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomInboundFileViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('businessUnits', [{ value: '0046', name: 'Camberwell Green' }]);
    fixture.componentRef.setInput('source', [{ value: 'ALLPAY', name: 'Allpay' }]);
    fixture.componentRef.setInput('sourceList', [{ value: 'SOURCE', name: 'RAW' }]);
  });

  it('renders the heading and separator, passes filter inputs and forwards submissions', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Inbound interface files');
    expect(fixture.nativeElement.querySelector('hr.govuk-section-break--visible')).not.toBeNull();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    expect(filters.businessUnits).toEqual(component.businessUnits);
    expect(filters.source).toEqual(component.source);
    expect(filters.sourceList).toEqual(component.sourceList);
    expect(filters.isInbound).toBe(true);
    const submit = vi.spyOn(component.formSubmit, 'emit');
    fixture.nativeElement.querySelector('button[type=submit]').click();
    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: filters.filtersForm.getRawValue(),
      nestedFlow: false,
    });
  });

  it('waits for results before showing an empty state', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('There are no inbound interface files to display.');
    fixture.componentRef.setInput('tableData', []);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
  });

  it('renders prepared row labels and sorts by the supplied numeric date', () => {
    fixture.componentRef.setInput('tableData', [
      row({ 'File ID': 1002, Title: 'older.xml', 'Date and time': 0 }),
      row(),
    ]);
    fixture.detectChanges();
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('td[id^="title-"]') as NodeListOf<HTMLElement>).map(
        (cell) => cell.textContent,
      ),
    ).toEqual(['original.dat', 'older.xml']);
    expect(fixture.nativeElement.querySelector('td#business-unit-0').textContent).toBe('Camberwell Green');
    expect(fixture.nativeElement.querySelector('td#date-and-time-0').textContent).toBe('20 Oct 2026 at 13:00');
    expect(fixture.nativeElement.querySelector('td#type-0').textContent).toBe('RAW');
  });

  it('leaves action cells empty when no consumer template is supplied', () => {
    fixture.componentRef.setInput('tableData', [row(), row({ 'File ID': 1002, Status: 'File failed' })]);
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td[id^="actions-"]') as NodeListOf<HTMLElement>;
    expect(cells).toHaveLength(2);
    expect(Array.from(cells).every((cell) => cell.textContent?.trim() === '')).toBe(true);
  });

  it('renders consumer actions with the row context and leaves eligibility to the consumer', () => {
    const hostFixture = TestBed.createComponent(InboundViewerTestHostComponent);
    const host = hostFixture.componentInstance;
    const allowed = row({ Status: 'Consumer-defined status' });
    host.rows = [allowed, row({ 'File ID': 1002, Status: 'Ready' })];
    host.downloadableIds.add(1001);
    hostFixture.detectChanges();

    const action = hostFixture.nativeElement.querySelector('#consumer-action-1001') as HTMLButtonElement;
    expect(action.textContent).toContain('Retrieve original.dat');
    expect(hostFixture.nativeElement.querySelector('#consumer-action-1002')).toBeNull();
    action.click();
    expect(host.requestDownload).toHaveBeenCalledExactlyOnceWith(allowed);
  });

  it('preserves the current table page when a consumer handles an action', () => {
    const hostFixture = TestBed.createComponent(InboundViewerTestHostComponent);
    const host = hostFixture.componentInstance;
    host.rows = Array.from({ length: 26 }, (_, index) => row({ 'File ID': index + 1 }));
    host.downloadableIds.add(26);
    hostFixture.detectChanges();
    const table = hostFixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))
      .componentInstance as CustomFileInterfaceViewerInboundTableWrapperComponent;
    table.onPageChange(2);
    hostFixture.detectChanges();
    hostFixture.nativeElement.querySelector('#consumer-action-26').click();
    hostFixture.detectChanges();
    expect(host.requestDownload).toHaveBeenCalledExactlyOnceWith(host.rows[25]);
    expect(table.currentPageSignal()).toBe(2);
    expect(hostFixture.nativeElement.querySelector('#consumer-action-26')).not.toBeNull();
  });
});
