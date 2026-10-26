import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer/constants';
import { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import { CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/constants';
import { CustomFileInterfaceViewerTableWrapperComponent } from './custom-file-interface-viewer-table-wrapper.component';

const row: ICustomFileInterfaceViewerTableData = {
  'File ID': 1001,
  'Date and time': 1792497900000,
  dateTimeDisplay: '20 Oct 2026 at 13:05',
  Title: 'mock.dat',
  Type: 'RAW',
  'Business unit': 'Test business unit',
  Source: 'Allpay',
  Target: 'ANT CSV',
  Status: 'Ready',
  Actions: null,
};

/**
 * Creates distinct chronological rows to exercise sorting and page boundaries.
 * @param count - Number of rows in the result set.
 * @returns Prepared table rows ordered from oldest to newest.
 */
function createRows(count: number): ICustomFileInterfaceViewerTableData[] {
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
  imports: [CustomFileInterfaceViewerTableWrapperComponent],
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
  public onAction(file: ICustomFileInterfaceViewerTableData, event: Event): void {
    event.preventDefault();
    this.action(file, event);
  }
}

describe.each([
  {
    direction: 'inbound',
    isInbound: true,
    columns: ['Date and time', 'Title', 'Type', 'Business unit', 'Source', 'Status', 'Action'],
    values: ['20 Oct 2026 at 13:05', 'mock.dat', 'RAW', 'Test business unit', 'Allpay', 'Ready', ''],
  },
  {
    direction: 'outbound',
    isInbound: false,
    columns: ['Date and time', 'Title', 'Business unit', 'Target', 'Status', 'Action'],
    values: ['20 Oct 2026 at 13:05', 'mock.dat', 'Test business unit', 'ANT CSV', 'Ready', ''],
  },
])(
  'CustomFileInterfaceViewerTableWrapperComponent ($direction)',
  ({ direction, isInbound, columns, values: expectedValues }) => {
    let fixture: ComponentFixture<CustomFileInterfaceViewerTableWrapperComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CustomFileInterfaceViewerTableWrapperComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(CustomFileInterfaceViewerTableWrapperComponent);
      fixture.componentRef.setInput('isInbound', isInbound);
      fixture.componentRef.setInput(
        'existingSortState',
        isInbound
          ? CUSTOM_FILE_INTERFACE_VIEWER_INBOUND_TABLE_WRAPPER_SORT_DEFAULT
          : CUSTOM_FILE_INTERFACE_VIEWER_TABLE_SORT_DEFAULT,
      );
      fixture.componentRef.setInput('tableData', [row]);
    });

    it('renders the direction-specific columns, display values and singular result count', () => {
      fixture.detectChanges();
      const headings = Array.from(fixture.nativeElement.querySelectorAll('thead th'), (cell) =>
        (cell as HTMLElement).textContent?.trim(),
      );
      const cells = Array.from(fixture.nativeElement.querySelectorAll('tbody td'), (cell) =>
        (cell as HTMLElement).textContent?.trim(),
      );
      expect(headings).toEqual(columns);
      expect(cells).toEqual(expectedValues);
      expect(fixture.nativeElement.querySelector('caption').textContent.trim()).toBe(
        `${isInbound ? 'Inbound' : 'Outbound'} interface files`,
      );
      expect(fixture.nativeElement.querySelector('th:last-child button').textContent.trim()).toBe('Action');
      expect(fixture.nativeElement.querySelector('td#actions-0 a')).toBeNull();
      expect(fixture.nativeElement.textContent).toContain('Showing 1 result');
      expect(fixture.nativeElement.textContent).not.toContain('Showing 1 results');
    });

    it('sorts by numeric timestamps while retaining the supplied display text', () => {
      fixture.componentRef.setInput('tableData', [
        { ...row, 'File ID': 1, 'Date and time': 20, dateTimeDisplay: 'A later display label' },
        { ...row, 'File ID': 2, 'Date and time': 3, dateTimeDisplay: 'Z earlier display label' },
      ]);
      fixture.detectChanges();
      const dates = Array.from(fixture.nativeElement.querySelectorAll('td[id^="date-and-time-"]'), (cell) =>
        (cell as HTMLElement).textContent?.trim(),
      );
      expect(dates).toEqual(['A later display label', 'Z earlier display label']);
    });

    it('renders a zero-result count without pagination', () => {
      fixture.componentRef.setInput('tableData', []);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(0);
      expect(fixture.nativeElement.textContent).toContain('Showing 0 results');
      expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeNull();
    });

    it('preserves input order when no existing sort state is supplied', () => {
      const rows = createRows(2);
      fixture.componentRef.setInput('existingSortState', null);
      fixture.componentRef.setInput('tableData', rows);
      fixture.detectChanges();
      expect(fixture.componentInstance.paginatedTableDataComputed()).toEqual(rows);
      expect(fixture.nativeElement.textContent).toContain('Showing 2 results');
    });

    it.each(columns)('sorts %s in both directions when rows arrive after empty unsorted results', (column) => {
      fixture.componentRef.setInput('existingSortState', null);
      fixture.componentRef.setInput('tableData', []);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(0);

      const columnKey = column === 'Action' ? 'Actions' : column;
      const rows = createRows(3).map((file, index) => ({
        ...file,
        [columnKey]:
          columnKey === 'Date and time' || columnKey === 'Title' ? file[columnKey] : ['Alpha', 'Bravo', 'Zulu'][index],
      }));
      fixture.componentRef.setInput('tableData', [rows[1], rows[2], rows[0]]);
      fixture.detectChanges();
      const titles = () =>
        Array.from(fixture.nativeElement.querySelectorAll('td[id^="title-"]'), (cell) =>
          (cell as HTMLElement).textContent?.trim(),
        );
      const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
      const header = headers.find((item) => item.textContent?.trim() === column)!;
      const button = header.querySelector('button')!;
      const status = fixture.nativeElement.querySelector('output[aria-live="polite"]') as HTMLOutputElement;
      expect(titles()).toEqual(['file-02.dat', 'file-03.dat', 'file-01.dat']);
      expect(header.getAttribute('aria-sort')).toBe('none');

      button.click();
      fixture.detectChanges();

      expect(titles()).toEqual(['file-01.dat', 'file-02.dat', 'file-03.dat']);
      expect(header.getAttribute('aria-sort')).toBe('ascending');
      expect(status.textContent?.trim()).toBe(`Sorted by ${columnKey} (ascending)`);

      button.click();
      fixture.detectChanges();

      expect(titles()).toEqual(['file-03.dat', 'file-02.dat', 'file-01.dat']);
      expect(header.getAttribute('aria-sort')).toBe('descending');
      expect(status.textContent?.trim()).toBe(`Sorted by ${columnKey} (descending)`);
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

      expect(initialIds).toHaveLength(3 * columns.length);
      expect(initialIds.every(Boolean)).toBe(true);
      expect(new Set(initialIds).size).toBe(initialIds.length);

      (fixture.nativeElement.querySelector('thead th:nth-child(2) button') as HTMLButtonElement).click();
      fixture.detectChanges();

      const sortedCells = Array.from(fixture.nativeElement.querySelectorAll('tbody td')) as HTMLTableCellElement[];
      const sortedIds = sortedCells.map((cell) => cell.id);
      expect(sortedIds.every(Boolean)).toBe(true);
      expect(new Set(sortedIds).size).toBe(sortedIds.length);
    });

    it.each(columns)('sorts %s through its accessible column button and resets the current page', (column) => {
      const columnKey = column === 'Action' ? 'Actions' : column;
      fixture.componentRef.setInput('tableData', createRows(26));
      fixture.detectChanges();
      fixture.componentInstance.currentPageSignal.set(2);
      fixture.detectChanges();
      const sort = vi.spyOn(fixture.componentInstance.abstractSortState, 'emit');
      const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
      const header = headers.find((item) => item.textContent?.trim() === column)!;
      const button = header.querySelector('button')!;

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.currentPageSignal()).toBe(1);
      expect(header.getAttribute('aria-sort')).toBe('ascending');
      expect(sort).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ [columnKey]: 'ascending' }));
      expect(fixture.componentInstance.sortedColumnTitleSignal()).toBe(columnKey);
      expect(fixture.componentInstance.paginatedTableDataComputed()).toHaveLength(25);
      if (column === 'Date and time' || column === 'Title') {
        expect(fixture.componentInstance.paginatedTableDataComputed()[0].Title).toBe('file-01.dat');
      }

      button.click();
      fixture.detectChanges();

      expect(header.getAttribute('aria-sort')).toBe('descending');
      expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ [columnKey]: 'descending' }));
    });

    it.each(columns.filter((column) => column !== 'Title'))(
      'sorts omitted %s in both directions after a partial custom sort',
      (column) => {
        const columnKey = column === 'Action' ? 'Actions' : column;
        const rows = createRows(2)
          .map((file, index) => ({
            ...file,
            [columnKey]: columnKey === 'Date and time' ? index + 1 : ['Alpha', 'Zulu'][index],
          }))
          .reverse();
        fixture.componentRef.setInput('existingSortState', Object.freeze({ Title: 'ascending' }));
        fixture.componentRef.setInput('tableData', rows);
        fixture.detectChanges();
        const titles = () =>
          Array.from(fixture.nativeElement.querySelectorAll('td[id^="title-"]'), (cell) =>
            (cell as HTMLElement).textContent?.trim(),
          );
        const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
        const header = headers.find((item) => item.textContent?.trim() === column)!;
        const button = header.querySelector('button')!;
        const status = fixture.nativeElement.querySelector('output[aria-live="polite"]') as HTMLOutputElement;
        expect(titles()).toEqual(['file-01.dat', 'file-02.dat']);
        expect(header.getAttribute('aria-sort')).toBe('none');
        expect(status.textContent?.trim()).toBe('Sorted by Title (ascending)');

        button.click();
        fixture.detectChanges();

        expect(titles()).toEqual(['file-01.dat', 'file-02.dat']);
        expect(header.getAttribute('aria-sort')).toBe('ascending');
        expect(status.textContent?.trim()).toBe(`Sorted by ${columnKey} (ascending)`);

        button.click();
        fixture.detectChanges();

        expect(titles()).toEqual(['file-02.dat', 'file-01.dat']);
        expect(header.getAttribute('aria-sort')).toBe('descending');
        expect(status.textContent?.trim()).toBe(`Sorted by ${columnKey} (descending)`);
      },
    );

    it('sorts supplied action labels and blank cells in both directions', () => {
      fixture.componentRef.setInput(
        'tableData',
        createRows(4).map((file, index) => ({ ...file, Actions: index % 2 === 0 ? 'Download' : '' })),
      );
      fixture.detectChanges();
      const actionHeader = fixture.nativeElement.querySelector('th:last-child') as HTMLTableCellElement;
      const button = actionHeader.querySelector('button')!;
      const titles = () =>
        Array.from(fixture.nativeElement.querySelectorAll('td[id^="title-"]'), (cell) =>
          (cell as HTMLElement).textContent?.trim(),
        );
      expect(titles()).toEqual(['file-04.dat', 'file-03.dat', 'file-02.dat', 'file-01.dat']);

      button.click();
      fixture.detectChanges();

      expect(titles()).toEqual(['file-02.dat', 'file-04.dat', 'file-01.dat', 'file-03.dat']);
      expect(actionHeader.getAttribute('aria-sort')).toBe('ascending');
      expect(fixture.nativeElement.querySelector('output[aria-live="polite"]').textContent.trim()).toBe(
        'Sorted by Actions (ascending)',
      );
      expect(fixture.nativeElement.querySelector('td#actions-0').textContent.trim()).toBe('');
      expect(fixture.nativeElement.querySelector('td#actions-0 a')).toBeNull();

      button.click();
      fixture.detectChanges();

      expect(titles()).toEqual(['file-01.dat', 'file-03.dat', 'file-02.dat', 'file-04.dat']);
      expect(actionHeader.getAttribute('aria-sort')).toBe('descending');
      expect(fixture.nativeElement.querySelector('output[aria-live="polite"]').textContent.trim()).toBe(
        'Sorted by Actions (descending)',
      );
    });

    it('shows 25 rows per page, uses the direction-specific pagination ID and focuses new rows', async () => {
      fixture.componentRef.setInput('tableData', createRows(26));
      fixture.detectChanges();
      expect(fixture.componentInstance.itemsPerPageSignal()).toBe(25);
      expect(fixture.nativeElement.querySelector(`#${direction}-file-viewer-pagination`)).not.toBeNull();
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

    it('replaces results and returns pagination to page one after a new tableData input', () => {
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

    it('keeps results and the current page when an unrelated input changes', () => {
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
  },
);

describe('CustomFileInterfaceViewerTableWrapperComponent action templates', () => {
  it('retains the inbound selector alias and delivers caller-owned action clicks to the template owner', async () => {
    await TestBed.configureTestingModule({ imports: [TableActionHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TableActionHostComponent);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('td#actions-0 a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Open mock.dat');
    expect(link.getAttribute('href')).toBe('/example-files/1001');
    expect(fixture.nativeElement.querySelector('td#source-0').textContent.trim()).toBe('Allpay');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.action).toHaveBeenCalledExactlyOnceWith(row, click);
  });
});
