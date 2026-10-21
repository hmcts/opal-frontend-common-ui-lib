import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { IFileSaveOptions } from '../interfaces/file-save-options.interface';
import { getFileResponseOptions } from './file-response-options.utils';

describe('getFileResponseOptions', () => {
  it('preserves the caller link and event while applying explicit filename and MIME overrides immutably', () => {
    const options: IFileSaveOptions = {
      link: document.createElement('a'),
      event: new MouseEvent('click'),
      filename: 'chosen.csv',
      fallbackFilename: 'fallback.csv',
      mimeType: 'text/csv',
    };
    const response = new HttpResponse({
      body: new Blob(['mock'], { type: 'text/plain' }),
      headers: new HttpHeaders({
        'Content-Disposition': 'attachment; filename="response.txt"',
        'Content-Type': 'application/pdf',
      }),
    });

    expect(getFileResponseOptions(response, options)).toEqual(options);
    expect(getFileResponseOptions(response, options)).not.toBe(options);
    expect(options.filename).toBe('chosen.csv');
    expect(response.body?.type).toBe('text/plain');
  });

  it('uses the response filename and existing Blob MIME type ahead of fallbacks and headers', () => {
    const response = new HttpResponse({
      body: new Blob(['mock'], { type: 'application/xml' }),
      headers: new HttpHeaders({
        'Content-Disposition': 'attachment; filename="response.xml"',
        'Content-Type': 'text/plain',
      }),
    });
    const result = getFileResponseOptions(response, {
      link: document.createElement('a'),
      fallbackFilename: 'fallback.xml',
    });
    expect(result.filename).toBe('response.xml');
    expect(result.mimeType).toBe('application/xml');
  });

  it.each<BlobPart>([new Blob(['mock']), 'mock text'])(
    'uses response MIME headers when content has no MIME label',
    (body) => {
      const response = new HttpResponse({
        body,
        headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' }),
      });
      const result = getFileResponseOptions(response, {
        link: document.createElement('a'),
        fallbackFilename: 'metadata.xml',
      });
      expect(result.filename).toBe('metadata.xml');
      expect(result.mimeType).toBe('application/octet-stream');
    },
  );

  it('uses the default filename and leaves MIME type unspecified when no metadata exists', () => {
    const result = getFileResponseOptions(new HttpResponse({ body: 'mock' }), { link: document.createElement('a') });
    expect(result.filename).toBe('download');
    expect(result.mimeType).toBeUndefined();
  });

  it('retains an explicitly empty MIME label and ignores an empty fallback filename', () => {
    const result = getFileResponseOptions(new HttpResponse({ body: new Blob(['mock'], { type: 'text/plain' }) }), {
      link: document.createElement('a'),
      fallbackFilename: '',
      mimeType: '',
    });
    expect(result.filename).toBe('download');
    expect(result.mimeType).toBe('');
  });
});
