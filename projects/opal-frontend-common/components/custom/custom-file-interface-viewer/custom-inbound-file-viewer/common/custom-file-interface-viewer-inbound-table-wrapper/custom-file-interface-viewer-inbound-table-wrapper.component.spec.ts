import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT } from './constants/custom-file-interface-viewer-inbound-table-wrapper-sort-default.constant';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './custom-file-interface-viewer-inbound-table-wrapper.component';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from './interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';

const row: ICustomFileInterfaceViewerInboundTableWrapperTableData = {
  'File ID': 1001,
  'Date and time': null,
  dateTimeDisplay: '20 Oct 2026 at 13:05',
  Title: 'mock.dat',
  Type: 'SOURCE',
  'Business unit': '77',
  Source: 'ALLPAY',
  Status: 'Ready',
  Actions: null,
};

/**
 * Creates distinct chronological rows to exercise sorting and page boundaries.
 * @param count - Number of rows in the result set.
 * @returns Prepared table rows ordered from oldest to newest.
 */
function createRows(count: number): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
  return Array.from({ length: count }, (_, index) => ({
    ...row,
    'File ID': index + 1,
    'Date and time': index + 1,
    dateTimeDisplay: `Date ${index + 1}`,
    Title: `file-${String(index + 1).padStart(2, '0')}.dat`,
  }));
}

@Component({
  selector: 'opal-lib-table-action-host',
  imports: [CustomFileInterfaceViewerInboundTableWrapperComponent],
  template: `
    <ng-template #action let-file>
      <a [href]="'/example-files/' + file['File ID']" (click)="onAction(file, $event)">Open {{ file.Title }}</a>
    </ng-template>
    <opal-lib-custom-file-interface-viewer-inbound-table-wrapper
      [existingSortState]="sortState"
      [tableData]="files"
      [actionTemplate]="action"
    ></opal-lib-custom-file-interface-viewer-inbound-table-wrapper>
  `,
})
class TableActionHostComponent {
  public readonly files = [row];
  public readonly sortState = CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT;
  public readonly action = vi.fn();

  /**
   * Keeps navigation with the caller and records the selected row action.
   * @param file - File represented by the clicked action.
   * @param event - Native anchor click event.
   */
  public onAction(file: ICustomFileInterfaceViewerInboundTableWrapperTableData, event: Event): void {
    event.preventDefault();
    this.action(file, event);
  }
}

describe('CustomFileInterfaceViewerInboundTableWrapperComponent', () => {
  let fixture: ComponentFixture<CustomFileInterfaceViewerInboundTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerInboundTableWrapperComponent, TableActionHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomFileInterfaceViewerInboundTableWrapperComponent);
    fixture.componentRef.setInput('existingSortState', CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT);
    fixture.componentRef.setInput('tableData', [row]);
  });

  it('renders the date and time display value supplied with each row', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('td#date-and-time-0').textContent).toBe('20 Oct 2026 at 13:05');
  });

  it('renders an empty action cell when no action template is supplied', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('td#actions-0').textContent.trim()).toBe('');
    expect(fixture.nativeElement.querySelector('td#actions-0 a')).toBeNull();
  });

  it('renders caller-owned row actions and delivers their clicks to the template owner', () => {
    const hostFixture = TestBed.createComponent(TableActionHostComponent);
    hostFixture.detectChanges();
    const link = hostFixture.nativeElement.querySelector('td#actions-0 a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Open mock.dat');
    expect(link.getAttribute('href')).toBe('/example-files/1001');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(hostFixture.componentInstance.action).toHaveBeenCalledExactlyOnceWith(row, click);
  });

  it('renders a zero-result count without pagination', () => {
    fixture.componentRef.setInput('tableData', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('Showing 0 results');
    expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeNull();
  });

  it('renders the singular result count and every prepared display field', () => {
    fixture.detectChanges();

    const values = Array.from(fixture.nativeElement.querySelectorAll('tbody td'), (cell) =>
      (cell as HTMLTableCellElement).textContent?.trim(),
    );
    expect(values).toEqual(['20 Oct 2026 at 13:05', 'mock.dat', 'SOURCE', '77', 'ALLPAY', 'Ready', '']);
    expect(fixture.nativeElement.textContent).toContain('Showing 1 result');
    expect(fixture.nativeElement.textContent).not.toContain('Showing 1 results');
    expect(fixture.nativeElement.querySelector('th:last-child').textContent.trim()).toBe('Action');
    expect(fixture.nativeElement.querySelector('th:last-child button')).toBeNull();
  });

  it('preserves input order when no existing sort state is supplied', () => {
    const rows = createRows(2);
    fixture.componentRef.setInput('existingSortState', null);
    fixture.componentRef.setInput('tableData', rows);
    fixture.detectChanges();

    expect(fixture.componentInstance.paginatedTableDataComputed()).toEqual(rows);
    expect(fixture.nativeElement.textContent).toContain('Showing 2 results');
  });

  it('keeps distinct row views for files without IDs when sorting and replacing results', () => {
    const rows = createRows(3)
      .map((file) => ({ ...file, 'File ID': null }))
      .reverse();
    fixture.componentRef.setInput('existingSortState', null);
    fixture.componentRef.setInput('tableData', rows);
    fixture.detectChanges();
    const initialRows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

    (fixture.nativeElement.querySelector('thead th:nth-child(2) button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const sortedRows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    expect(sortedRows.map((element) => element.cells[1].textContent)).toEqual([
      'file-01.dat',
      'file-02.dat',
      'file-03.dat',
    ]);
    sortedRows.forEach((element, index) => expect(element).toBe(initialRows[2 - index]));

    const replacement = { ...rows[1], Title: 'file-02-refreshed.dat' };
    fixture.componentRef.setInput('tableData', [rows[2], replacement]);
    fixture.detectChanges();

    const updatedRows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    expect(updatedRows).toHaveLength(2);
    expect(updatedRows[0]).toBe(initialRows[2]);
    expect(updatedRows[1]).not.toBe(initialRows[1]);
    expect(updatedRows[1].cells[1].textContent).toBe('file-02-refreshed.dat');
    expect(initialRows[0].parentElement).toBeNull();
    expect(initialRows[1].parentElement).toBeNull();
  });

  it('gives every cell a unique ID, including rows without file IDs and after sorting', () => {
    fixture.componentRef.setInput(
      'tableData',
      createRows(3).map((file) => ({ ...file, 'File ID': null })),
    );
    fixture.detectChanges();
    const initialCells = Array.from(fixture.nativeElement.querySelectorAll('tbody td')) as HTMLTableCellElement[];
    const initialIds = initialCells.map((cell) => cell.id);

    expect(initialIds).toHaveLength(21);
    expect(initialIds.every(Boolean)).toBe(true);
    expect(new Set(initialIds).size).toBe(initialIds.length);

    (fixture.nativeElement.querySelector('thead th:nth-child(2) button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const sortedCells = Array.from(fixture.nativeElement.querySelectorAll('tbody td')) as HTMLTableCellElement[];
    const sortedIds = sortedCells.map((cell) => cell.id);
    expect(sortedIds.every(Boolean)).toBe(true);
    expect(new Set(sortedIds).size).toBe(sortedIds.length);
  });

  it.each(['Date and time', 'Title', 'Type', 'Business unit', 'Source', 'Status'])(
    'sorts %s through its accessible column button and resets the current page',
    (column) => {
      fixture.componentRef.setInput('tableData', createRows(26));
      fixture.detectChanges();
      fixture.componentInstance.currentPageSignal.set(2);
      fixture.detectChanges();
      const sort = vi.spyOn(fixture.componentInstance.abstractSortState, 'emit');
      const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
      const header = headers.find((item) => item.textContent?.trim() === column)!;
      const button = header.querySelector('button')!;
      const expectedDirection = 'ascending';

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.currentPageSignal()).toBe(1);
      expect(header.getAttribute('aria-sort')).toBe(expectedDirection);
      expect(sort).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ [column]: expectedDirection }));
      expect(fixture.componentInstance.sortedColumnTitleSignal()).toBe(column);
      expect(fixture.componentInstance.paginatedTableDataComputed()).toHaveLength(25);
      if (column === 'Date and time' || column === 'Title') {
        expect(fixture.componentInstance.paginatedTableDataComputed()[0].Title).toBe('file-01.dat');
      }

      button.click();
      fixture.detectChanges();

      expect(header.getAttribute('aria-sort')).toBe('descending');
      expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ [column]: 'descending' }));
    },
  );

  it('shows 25 rows per page, changes page from the pagination links and focuses the new rows', async () => {
    fixture.componentRef.setInput('tableData', createRows(26));
    fixture.detectChanges();

    expect(fixture.componentInstance.itemsPerPageSignal()).toBe(25);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(25);
    expect(fixture.nativeElement.querySelector('tbody td#title-0').textContent).toBe('file-26.dat');
    expect(fixture.nativeElement.querySelector('.moj-pagination__results').textContent).toContain(
      'Showing 1 to 25 of 26 total results',
    );

    (fixture.nativeElement.querySelector('a[rel="next"]') as HTMLAnchorElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.currentPageSignal()).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('tbody td#title-0').textContent).toBe('file-01.dat');
    expect(fixture.nativeElement.querySelector('.moj-pagination__results').textContent).toContain(
      'Showing 26 to 26 of 26 total results',
    );
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('tbody tr'));

    (fixture.nativeElement.querySelector('a[rel="prev"]') as HTMLAnchorElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.currentPageSignal()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(25);
  });

  it('replaces input results and returns pagination to page one', () => {
    fixture.componentRef.setInput('tableData', createRows(26));
    fixture.detectChanges();
    fixture.componentInstance.currentPageSignal.set(2);
    fixture.detectChanges();

    fixture.componentRef.setInput('tableData', [{ ...row, Title: 'refreshed.dat' }]);
    fixture.detectChanges();

    expect(fixture.componentInstance.currentPageSignal()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('tbody td#title-0').textContent).toBe('refreshed.dat');
    expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeNull();
  });

  it('does not replace the result set or reset pagination when an unrelated input changes', () => {
    fixture.componentRef.setInput('tableData', createRows(26));
    fixture.detectChanges();
    fixture.componentInstance.currentPageSignal.set(2);
    fixture.detectChanges();
    const setTableData = vi.spyOn(fixture.componentInstance, 'setTableData');

    fixture.componentRef.setInput('actionTemplate', null);
    fixture.detectChanges();

    expect(setTableData).not.toHaveBeenCalled();
    expect(fixture.componentInstance.currentPageSignal()).toBe(2);
    expect(fixture.componentInstance.paginatedTableDataComputed()).toHaveLength(1);
  });
});
