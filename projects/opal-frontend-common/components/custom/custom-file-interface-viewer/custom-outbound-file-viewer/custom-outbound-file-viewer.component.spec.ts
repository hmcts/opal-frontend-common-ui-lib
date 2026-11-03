import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomOutboundFileViewerComponent } from './custom-outbound-file-viewer.component';
import type { ICustomFileInterfaceViewerOutboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer/interfaces';

function row(
  overrides: Partial<ICustomFileInterfaceViewerOutboundTableWrapperTableData> = {},
): ICustomFileInterfaceViewerOutboundTableWrapperTableData {
  return {
    'File ID': 1001,
    'Date and time': 1792497600000,
    dateTimeDisplay: '20 Oct 2026 at 13:00',
    Title: 'outbound.csv',
    'Business unit': 'Test business unit',
    Target: 'ANT CSV',
    Status: 'Ready',
    Actions: null,
    ...overrides,
  };
}

describe('CustomOutboundFileViewerComponent', () => {
  let fixture: ComponentFixture<CustomOutboundFileViewerComponent>;

  function setRows(rows: ICustomFileInterfaceViewerOutboundTableWrapperTableData[] | null): void {
    fixture.componentRef.setInput('tableData', rows);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOutboundFileViewerComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomOutboundFileViewerComponent);
    fixture.componentRef.setInput('businessUnits', [{ value: '0046', name: 'Test business unit' }]);
  });

  it('renders only business-unit and date filters and forwards an applied filter submission', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Outbound interface files');
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-business-unit')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('opal-lib-custom-date-filter')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-type')).toBeNull();
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-source')).toBeNull();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    const submit = vi.spyOn(fixture.componentInstance.formSubmit, 'emit');
    filters.filtersForm.controls.businessUnit.setValue('0046');
    filters.filtersForm.controls.businessUnit.markAsDirty();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[type=submit]').click();
    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: filters.filtersForm.getRawValue(),
      nestedFlow: false,
    });
  });

  it('always allows valid unchanged filters to be submitted again', () => {
    const submit = vi.spyOn(fixture.componentInstance.formSubmit, 'emit');
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;
    expect(refresh.disabled).toBe(false);
    refresh.click();
    fixture.detectChanges();
    expect(refresh.disabled).toBe(false);
    refresh.click();
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it('waits for results and shows the outbound empty state only after an empty response', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('There are no outbound interface files to display.');
    setRows([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no outbound interface files to display.');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('renders outbound target labels and sorts numeric dates newest first without inbound columns', () => {
    setRows([row({ 'File ID': 1002, 'Date and time': 0, Title: 'older.csv', Target: 'Allpay Out' }), row()]);
    fixture.detectChanges();
    const headings = Array.from(fixture.nativeElement.querySelectorAll('thead th'), (cell) =>
      (cell as HTMLElement).textContent?.trim(),
    );
    expect(headings).toEqual(['Date and time', 'Title', 'Business unit', 'Target', 'Status', 'Action']);
    const targets = Array.from(fixture.nativeElement.querySelectorAll('td[id^="target-"]'), (cell) =>
      (cell as HTMLElement).textContent?.trim(),
    );
    expect(targets).toEqual(['ANT CSV', 'Allpay Out']);
    expect(fixture.nativeElement.querySelector('td[id^="date-and-time-"]').textContent).toBe('20 Oct 2026 at 13:00');
    expect(fixture.nativeElement.querySelector('td[id^="title-"]').textContent).toBe('outbound.csv');
    expect(fixture.nativeElement.querySelector('td[id^="type-"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('td[id^="source-"]')).toBeNull();
  });

  it('sorts the target column and paginates 25 rows with the outbound pagination ID', () => {
    setRows(
      Array.from({ length: 26 }, (_, index) =>
        row({
          'File ID': index + 1,
          'Date and time': index + 1,
          Title: `file-${index + 1}.csv`,
          Target: index === 0 ? 'ANT CSV' : 'Allpay Out',
        }),
      ),
    );
    fixture.detectChanges();
    const pagination = fixture.nativeElement.querySelector('#outbound-file-viewer-pagination');
    expect(pagination).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(25);
    const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
    const target = headers.find((cell) => cell.textContent?.trim() === 'Target')!;
    target.querySelector('button')!.click();
    fixture.detectChanges();
    expect(target.getAttribute('aria-sort')).toBe('ascending');
    expect(fixture.nativeElement.querySelector('td[id^="target-"]').textContent.trim()).toBe('ANT CSV');
    const next = pagination.querySelector('.govuk-pagination__next a') as HTMLAnchorElement;
    expect(next).not.toBeNull();
    next.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('td[id^="target-"]').textContent.trim()).toBe('Allpay Out');
  });

  it.each(['Ready', 'File failed', 'Consumer status'])(
    'leaves actions empty without a consumer template for %s',
    (Status) => {
      setRows([row({ Status })]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('td#actions-0').textContent.trim()).toBe('');
    },
  );
});

@Component({
  imports: [CustomOutboundFileViewerComponent],
  template: `
    <ng-template #action let-file>
      @if (file['File ID'] === 1001) {
        <button type="button" (click)="onAction(file)">Retrieve {{ file.Title }}</button>
      }
    </ng-template>
    <opal-lib-custom-outbound-file-viewer
      [businessUnits]="[]"
      [tableData]="rows"
      [actionTemplate]="action"
    ></opal-lib-custom-outbound-file-viewer>
  `,
})
class OutboundActionHostComponent {
  public readonly rows = [row({ Status: 'Consumer status' }), row({ 'File ID': 1002 })];
  public readonly onAction = vi.fn();
}

describe('CustomOutboundFileViewerComponent consumer actions', () => {
  it('passes row context through the shared viewer and leaves eligibility to the consumer', async () => {
    await TestBed.configureTestingModule({
      imports: [OutboundActionHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(OutboundActionHostComponent);
    fixture.detectChanges();
    const actions = fixture.nativeElement.querySelectorAll('td[id^="actions-"] button');
    expect(actions).toHaveLength(1);
    expect(actions[0].textContent.trim()).toBe('Retrieve outbound.csv');
    actions[0].click();
    expect(fixture.componentInstance.onAction).toHaveBeenCalledExactlyOnceWith(fixture.componentInstance.rows[0]);
  });
});
