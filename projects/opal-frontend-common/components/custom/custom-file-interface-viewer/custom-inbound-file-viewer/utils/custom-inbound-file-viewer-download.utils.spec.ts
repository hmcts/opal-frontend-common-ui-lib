import { describe, expect, it } from 'vitest';
import { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '../common/custom-file-interface-viewer-inbound-table-wrapper/interfaces/custom-file-interface-viewer-inbound-table-wrapper-table-data.interface';
import {
  canDownloadInterfaceFileRow,
  getDownloadableInterfaceFile,
  getInterfaceFileDownloadHref,
  getInterfaceFileDownloadOptions,
} from './custom-inbound-file-viewer-download.utils';

function row(
  overrides: Partial<ICustomFileInterfaceViewerInboundTableWrapperTableData> = {},
): ICustomFileInterfaceViewerInboundTableWrapperTableData {
  return {
    'File ID': 12,
    'Date and time': null,
    dateTimeDisplay: null,
    Title: 'payments.xlsx',
    Type: 'RAW',
    'Business unit': 'Camberwell Green',
    Source: 'Allpay',
    Status: 'Ready',
    Actions: null,
    ...overrides,
  };
}

describe('inbound file download utilities', () => {
  it.each(['Ready', 'File failed'])('allows %s rows with a file ID', (Status) => {
    expect(canDownloadInterfaceFileRow(row({ Status }))).toBe(true);
  });

  it.each([row({ 'File ID': null }), row({ Status: 'In-Progress' }), row({ Status: null })])(
    'hides downloads for an ineligible row',
    (file) => {
      expect(canDownloadInterfaceFileRow(file)).toBe(false);
    },
  );

  it('finds only the currently available downloadable row', () => {
    const ready = row();
    expect(getDownloadableInterfaceFile([row({ 'File ID': 13 }), ready], 12)).toBe(ready);
    expect(getDownloadableInterfaceFile([row({ Status: 'In-Progress' })], 12)).toBeUndefined();
    expect(getDownloadableInterfaceFile([ready], 99)).toBeUndefined();
    expect(getDownloadableInterfaceFile(null, 12)).toBeUndefined();
  });

  it('builds the content API path', () => {
    expect(getInterfaceFileDownloadHref(12)).toBe('/opal-file-handling-service/interface-files/12/content');
  });

  it.each(['payments.xlsx', null, ''])('builds binary download options for filename %s', (Title) => {
    const link = document.createElement('a');
    const event = new MouseEvent('click', { cancelable: true });
    const options = getInterfaceFileDownloadOptions(row({ Title }), link, event);
    expect(options).toMatchObject({
      link,
      event,
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
      fallbackFilename: Title || 'interface-file-12',
    });
    expect(event.defaultPrevented).toBe(false);
  });
});
