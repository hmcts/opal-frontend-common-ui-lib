import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomFileInterfaceViewerTableWrapperComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-table-wrapper';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import { CustomFileInterfaceViewerComponent } from './custom-file-interface-viewer.component';

function row(overrides: Partial<ICustomFileInterfaceViewerTableData> = {}): ICustomFileInterfaceViewerTableData {
  return {
    'File ID': 1001,
    'Date and time': 1792497600000,
    dateTimeDisplay: '20 Oct 2026 at 13:00',
    Title: 'interface.dat',
    Type: 'RAW',
    'Business unit': 'Test business unit',
    Source: 'Allpay',
    Target: 'ANT CSV',
    Status: 'Ready',
    Actions: null,
    ...overrides,
  };
}

describe('CustomFileInterfaceViewerComponent', () => {
  let fixture: ComponentFixture<CustomFileInterfaceViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomFileInterfaceViewerComponent);
    fixture.componentRef.setInput('businessUnits', [{ value: '0046', name: 'Test business unit' }]);
  });

  it('passes filter choices, direction and forwards submitted form data', () => {
    fixture.componentRef.setInput('isInbound', true);
    fixture.componentRef.setInput('source', [{ value: 'ALLPAY', name: 'Allpay' }]);
    fixture.componentRef.setInput('sourceList', [{ value: 'SOURCE', name: 'RAW' }]);
    const submit = vi.spyOn(fixture.componentInstance.formSubmit, 'emit');
    fixture.detectChanges();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;

    expect(filters.businessUnits).toEqual([{ value: '0046', name: 'Test business unit' }]);
    expect(filters.source).toEqual([{ value: 'ALLPAY', name: 'Allpay' }]);
    expect(filters.sourceList).toEqual([{ value: 'SOURCE', name: 'RAW' }]);
    expect(filters.isInbound).toBe(true);
    expect(submit).not.toHaveBeenCalled();
    const form = { formData: filters.filtersForm.getRawValue(), nestedFlow: false };
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    expect(submit).toHaveBeenCalledExactlyOnceWith(form);
  });

  it.each([true, false])('renders the heading, separator and pending/empty results for isInbound=%s', (isInbound) => {
    fixture.componentRef.setInput('isInbound', isInbound);
    fixture.detectChanges();
    const direction = isInbound ? 'inbound' : 'outbound';
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe(
      `${isInbound ? 'Inbound' : 'Outbound'} interface files`,
    );
    expect(fixture.nativeElement.querySelector('hr.govuk-section-break--visible')).not.toBeNull();
    expect(fixture.nativeElement.querySelector(`#${direction}-interface-files-results`).tabIndex).toBe(-1);
    expect(fixture.nativeElement.textContent).not.toContain(`There are no ${direction} interface files to display.`);
    expect(fixture.nativeElement.querySelector('table')).toBeNull();

    fixture.componentRef.setInput('tableData', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(`There are no ${direction} interface files to display.`);
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it.each([true, false])('renders one shared results table with the supplied sort for isInbound=%s', (isInbound) => {
    fixture.componentRef.setInput('isInbound', isInbound);
    fixture.componentRef.setInput('tableData', [row({ 'File ID': 1002, Title: 'alpha.dat' }), row()]);
    fixture.componentRef.setInput('tableSort', { Title: 'ascending' });
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(By.directive(CustomFileInterfaceViewerTableWrapperComponent));
    expect(tables).toHaveLength(1);
    const table = tables[0].componentInstance as CustomFileInterfaceViewerTableWrapperComponent;
    expect(table.isInbound).toBe(isInbound);
    expect(fixture.nativeElement.querySelector('td#title-0').textContent).toBe('alpha.dat');
    expect(fixture.nativeElement.querySelector(isInbound ? 'td#source-0' : 'td#target-0').textContent.trim()).toBe(
      isInbound ? 'Allpay' : 'ANT CSV',
    );
  });

  it.each(['Type', 'Source'])('sorts inbound %s in both directions without a supplied sort state', (column) => {
    fixture.componentRef.setInput('isInbound', true);
    fixture.componentRef.setInput('tableData', [
      row({ 'File ID': 1, 'Date and time': 2, Title: 'transformed.dat', Type: 'TRANSFORMED', Source: 'NatWest' }),
      row({ 'File ID': 2, 'Date and time': 1, Title: 'source.dat', Type: 'RAW', Source: 'Allpay' }),
    ]);
    fixture.detectChanges();
    const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
    const header = headers.find((item) => item.textContent?.trim() === column)!;
    const button = header.querySelector('button')!;
    const titles = () =>
      Array.from(fixture.nativeElement.querySelectorAll('td[id^="title-"]'), (cell) =>
        (cell as HTMLElement).textContent?.trim(),
      );
    const status = fixture.nativeElement.querySelector('output[aria-live="polite"]') as HTMLOutputElement;
    expect(titles()).toEqual(['transformed.dat', 'source.dat']);

    button.click();
    fixture.detectChanges();

    expect(titles()).toEqual(['source.dat', 'transformed.dat']);
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(status.textContent?.trim()).toBe(`Sorted by ${column} (ascending)`);

    button.click();
    fixture.detectChanges();

    expect(titles()).toEqual(['transformed.dat', 'source.dat']);
    expect(header.getAttribute('aria-sort')).toBe('descending');
    expect(status.textContent?.trim()).toBe(`Sorted by ${column} (descending)`);
  });

  it.each(['Ready', 'File failed', 'Consumer status'])(
    'leaves actions empty without a consumer template for %s',
    (Status) => {
      fixture.componentRef.setInput('tableData', [row({ Status })]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('td#actions-0').textContent.trim()).toBe('');
      expect(fixture.nativeElement.querySelector('a[hidden]')).toBeNull();
    },
  );
});

@Component({
  imports: [CustomFileInterfaceViewerComponent],
  template: `
    <ng-template #action let-file>
      <button type="button" (click)="onAction(file, $event)">Retrieve {{ file.Title }}</button>
    </ng-template>
    <opal-lib-custom-file-interface-viewer
      [isInbound]="isInbound"
      [businessUnits]="[]"
      [tableData]="rows"
      [tableSort]="tableSort"
      [actionTemplate]="action"
    ></opal-lib-custom-file-interface-viewer>
  `,
})
class ViewerActionHostComponent {
  public isInbound = false;
  public rows = [row({ Status: 'Consumer status' })];
  public readonly tableSort = { Title: 'ascending' } as const;
  public readonly onAction = vi.fn();
}

describe('CustomFileInterfaceViewerComponent consumer actions', () => {
  it.each([true, false])('passes the current row to a consumer template for isInbound=%s', async (isInbound) => {
    await TestBed.configureTestingModule({
      imports: [ViewerActionHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ViewerActionHostComponent);
    fixture.componentInstance.isInbound = isInbound;
    fixture.detectChanges();
    const action = fixture.nativeElement.querySelector('td#actions-0 button') as HTMLButtonElement;
    const event = new MouseEvent('click', { bubbles: true });
    expect(action.textContent?.trim()).toBe('Retrieve interface.dat');
    action.dispatchEvent(event);
    expect(fixture.componentInstance.onAction).toHaveBeenCalledExactlyOnceWith(
      fixture.componentInstance.rows[0],
      event,
    );
  });

  it.each([true, false])(
    'keeps custom action templates sortable with a partial sort for isInbound=%s',
    async (isInbound) => {
      await TestBed.configureTestingModule({
        imports: [ViewerActionHostComponent],
        providers: [provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(ViewerActionHostComponent);
      const files = [
        row({ 'File ID': 1, Title: 'zulu.dat', Actions: 'Collect', Status: 'Consumer status' }),
        row({ 'File ID': 2, Title: 'alpha.dat', Actions: 'Retrieve', Status: 'Consumer status' }),
      ];
      fixture.componentInstance.isInbound = isInbound;
      fixture.componentInstance.rows = files;
      fixture.detectChanges();
      const actions = () =>
        Array.from(fixture.nativeElement.querySelectorAll('td[id^="actions-"] button'), (button) =>
          (button as HTMLButtonElement).textContent?.trim(),
        );
      const header = fixture.nativeElement.querySelector('thead th:last-child') as HTMLTableCellElement;
      const button = header.querySelector('button')!;
      expect(actions()).toEqual(['Retrieve alpha.dat', 'Retrieve zulu.dat']);

      button.click();
      fixture.detectChanges();

      expect(actions()).toEqual(['Retrieve zulu.dat', 'Retrieve alpha.dat']);
      expect(header.getAttribute('aria-sort')).toBe('ascending');
      const action = fixture.nativeElement.querySelector('td#actions-0 button') as HTMLButtonElement;
      const event = new MouseEvent('click', { bubbles: true });
      action.dispatchEvent(event);
      expect(fixture.componentInstance.onAction).toHaveBeenCalledExactlyOnceWith(files[0], event);
      expect(fixture.componentInstance.onAction.mock.calls[0][0]).toBe(files[0]);

      button.click();
      fixture.detectChanges();

      expect(actions()).toEqual(['Retrieve alpha.dat', 'Retrieve zulu.dat']);
      expect(header.getAttribute('aria-sort')).toBe('descending');
    },
  );
});
