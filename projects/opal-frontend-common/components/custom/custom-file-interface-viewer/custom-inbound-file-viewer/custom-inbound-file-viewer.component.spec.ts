import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './common/custom-file-interface-viewer-inbound-table-wrapper/custom-file-interface-viewer-inbound-table-wrapper.component';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import { CustomInboundFileViewerComponent } from './custom-inbound-file-viewer.component';

describe('CustomInboundFileViewerComponent', () => {
  let fixture: ComponentFixture<CustomInboundFileViewerComponent>;
  let component: CustomInboundFileViewerComponent;
  let response$: Subject<void>;
  const downloadFile = vi.fn();

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

  function setRows(rows: ICustomFileInterfaceViewerInboundTableWrapperTableData[] | null): void {
    fixture.componentRef.setInput('tableData', rows);
  }

  function downloadLink(id = 1001): HTMLAnchorElement | null {
    return fixture.nativeElement.querySelector(`#interface-file-download-${id}`);
  }

  beforeEach(async () => {
    response$ = new Subject<void>();
    downloadFile.mockReset().mockImplementation((_source: unknown, options: { event?: Event }) => {
      options.event?.preventDefault();
      return response$;
    });
    await TestBed.configureTestingModule({
      imports: [CustomInboundFileViewerComponent],
      providers: [provideRouter([]), { provide: FileService, useValue: { downloadFile } }],
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
    filters.filtersForm.controls.source.setValue('ALLPAY');
    filters.filtersForm.controls.source.markAsDirty();
    fixture.detectChanges();
    const form = { formData: filters.filtersForm.getRawValue(), nestedFlow: false };
    fixture.nativeElement.querySelector('button[type=submit]').click();
    expect(submit).toHaveBeenCalledExactlyOnceWith(form);
  });

  it('passes search failures to the filters so unchanged criteria can be retried', () => {
    fixture.componentRef.setInput('refreshFailed', true);
    fixture.detectChanges();
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;
    const submit = vi.spyOn(component.formSubmit, 'emit');

    expect(filters.refreshFailed).toBe(true);
    expect(refresh.disabled).toBe(false);
    refresh.click();
    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: filters.filtersForm.getRawValue(),
      nestedFlow: false,
    });

    fixture.componentRef.setInput('refreshFailed', false);
    fixture.detectChanges();
    expect(filters.refreshFailed).toBe(false);
    expect(refresh.disabled).toBe(true);
  });

  it('waits for results before showing an empty state', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('There are no inbound interface files to display.');
    setRows([]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('There are no inbound interface files to display.');
  });

  it('renders prepared row labels and sorts by the supplied numeric date', () => {
    setRows([row({ 'File ID': 1002, Title: 'older.xml', 'Date and time': 0 }), row()]);
    fixture.detectChanges();
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('td#title') as NodeListOf<HTMLElement>).map(
        (cell) => cell.textContent,
      ),
    ).toEqual(['original.dat', 'older.xml']);
    expect(fixture.nativeElement.querySelector('td#business-unit').textContent).toBe('Camberwell Green');
    expect(fixture.nativeElement.querySelector('td#date-and-time').textContent).toBe('20 Oct 2026 at 13:00');
    expect(fixture.nativeElement.querySelector('td#type').textContent).toBe('RAW');
  });

  it.each(['Ready', 'File failed'])('downloads a %s row through the caller-owned URL, anchor and event', (Status) => {
    setRows([row({ Status })]);
    fixture.detectChanges();
    const actionLink = downloadLink()!;
    const nativeLink = fixture.nativeElement.querySelector('a[hidden]') as HTMLAnchorElement;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    actionLink.dispatchEvent(click);
    expect(actionLink.getAttribute('href')).toBe('/opal-file-handling-service/interface-files/1001/content');
    expect(actionLink.getAttribute('aria-label')).toBe('Download original.dat');
    expect(nativeLink).not.toBe(actionLink);
    expect(nativeLink.hidden).toBe(true);
    expect(nativeLink.textContent?.trim()).toBe('Download file');
    expect(click.defaultPrevented).toBe(true);
    expect(downloadFile).toHaveBeenCalledExactlyOnceWith('/opal-file-handling-service/interface-files/1001/content', {
      link: nativeLink,
      event: click,
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
      fallbackFilename: 'original.dat',
    });
    response$.next(undefined);
    response$.complete();
    fixture.detectChanges();
    expect(component.downloadErrors()).toEqual([]);
    expect(downloadLink()!.textContent?.trim()).toBe('Download');
  });

  it.each([null, ''])('uses the file ID as a fallback for title %s', (Title) => {
    setRows([row({ Title })]);
    fixture.detectChanges();
    expect(downloadLink()!.getAttribute('aria-label')).toBe('Download interface file 1001');
    downloadLink()!.click();
    expect(downloadFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ fallbackFilename: 'interface-file-1001' }),
    );
  });

  it('displays an accessible download error, focuses the summary and returns focus to the action', async () => {
    setRows([row()]);
    fixture.detectChanges();
    downloadLink()!.click();
    response$.error(new HttpErrorResponse({ status: 422 }));
    fixture.detectChanges();
    await fixture.whenStable();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    expect(summary.textContent).toContain('The file could not be downloaded. Try again.');
    expect(document.activeElement).toBe(summary);
    const errorLink = summary.querySelector('a')!;
    errorLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(downloadLink());
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('original.dat');
  });

  it('falls back to focusing the results when a failed row is no longer displayed', () => {
    fixture.detectChanges();
    component.onDownloadErrorClick('interface-file-download-removed');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#inbound-interface-files-results'));
  });

  it('handles error links after the results container has been removed', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('#inbound-interface-files-results').remove();
    expect(() => component.onDownloadErrorClick('removed')).not.toThrow();
  });

  it.each([null, [], [row({ Status: 'In-Progress' })]])('prevents navigation for an unavailable download', (rows) => {
    setRows(rows);
    fixture.detectChanges();
    const click = new MouseEvent('click', { cancelable: true });
    component.onDownloadFile(1001, click);
    expect(click.defaultPrevented).toBe(true);
    expect(downloadFile).not.toHaveBeenCalled();
    expect(downloadLink()).toBeNull();
  });

  it('clears previous download errors when retrying', () => {
    setRows([row()]);
    fixture.detectChanges();
    component.onDownloadFile(1001, new MouseEvent('click', { cancelable: true }));
    response$.error(new HttpErrorResponse({ status: 500 }));
    expect(component.downloadErrors()).toHaveLength(1);
    response$ = new Subject<void>();
    component.onDownloadFile(1001, new MouseEvent('click', { cancelable: true }));
    expect(component.downloadErrors()).toEqual([]);
  });

  it.each(['success', 'failure'])('keeps the current page after a download %s', (outcome) => {
    setRows(Array.from({ length: 26 }, (_, index) => row({ 'File ID': index + 1 })));
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerInboundTableWrapperComponent))
      .componentInstance as CustomFileInterfaceViewerInboundTableWrapperComponent;
    table.onPageChange(2);
    fixture.detectChanges();
    downloadLink(26)!.click();
    if (outcome === 'success') {
      response$.next(undefined);
      response$.complete();
    } else {
      response$.error(new HttpErrorResponse({ status: 410 }));
    }
    fixture.detectChanges();
    expect(table.currentPageSignal()).toBe(2);
    expect(downloadLink(26)).not.toBeNull();
  });

  it('cancels a pending request when destroyed', () => {
    setRows([row()]);
    fixture.detectChanges();
    component.onDownloadFile(1001, new MouseEvent('click', { cancelable: true }));
    expect(response$.observed).toBe(true);
    fixture.destroy();
    expect(response$.observed).toBe(false);
  });
});
