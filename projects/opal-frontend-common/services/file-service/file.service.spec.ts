import {
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  provideHttpClient,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileService as PackagedFileService } from '@hmcts/opal-frontend-common/services/file-service';
import { FileService } from './file.service';
import { IFileDownloadOptions } from './interfaces/file-download-options.interface';
import { IFileSaveOptions } from './interfaces/file-save-options.interface';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;
  let response$: Subject<HttpResponse<BlobPart>>;
  let link: HTMLAnchorElement;
  let savedFiles: { filename: string; href: string }[];
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  function options(values: Omit<IFileDownloadOptions, 'link'> = {}): IFileDownloadOptions {
    return { link, ...values };
  }

  function readBlob(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(new Uint8Array(reader.result as ArrayBuffer)), { once: true });
      reader.addEventListener('error', () => reject(reader.error), { once: true });
      reader.readAsArrayBuffer(blob);
    });
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    response$ = new Subject<HttpResponse<BlobPart>>();
    createObjectURL.mockReset().mockReturnValue('blob:mock-download');
    revokeObjectURL.mockReset();
    savedFiles = [];
    link = document.createElement('a');
    link.hidden = true;
    document.body.appendChild(link);
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = createObjectURL;
        static override revokeObjectURL = revokeObjectURL;
      },
    );
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      savedFiles.push({ filename: this.download, href: this.href });
    });

    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.runOnlyPendingTimers();
    link.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([
    { filename: 'original.xml', type: 'application/xml', bytes: new TextEncoder().encode('<root />') },
    {
      filename: 'original.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
    },
  ])('saves $filename without changing its Blob or removing the caller anchor', ({ filename, type, bytes }) => {
    const blob = new Blob([bytes], { type });
    service.saveFile(blob, options({ filename }));

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
    expect(savedFiles).toEqual([{ filename, href: 'blob:mock-download' }]);
    expect(link.isConnected).toBe(true);
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('download')).toBeNull();
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.runOnlyPendingTimers();
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:mock-download');
  });

  it.each<[Omit<IFileSaveOptions, 'link'>, string]>([
    [{}, 'download'],
    [{ fallbackFilename: 'fallback.csv' }, 'fallback.csv'],
    [{ filename: 'explicit.csv', fallbackFilename: 'fallback.csv' }, 'explicit.csv'],
  ])('saves a Blob with filename options %j through both service entrypoints', (values, expectedFilename) => {
    for (const fileService of [service, TestBed.inject(PackagedFileService)]) {
      fileService.saveFile(new Blob(['mock']), options(values));
    }
    expect(savedFiles.map((file) => file.filename)).toEqual([expectedFilename, expectedFilename]);
  });

  it.each<[Omit<IFileSaveOptions, 'link'>, string | null, string]>([
    [{}, null, 'download'],
    [{ fallbackFilename: 'fallback.xml' }, null, 'fallback.xml'],
    [{ fallbackFilename: 'fallback.xml' }, 'attachment; filename="response.xml"', 'response.xml'],
    [
      { filename: 'explicit.xml', fallbackFilename: 'fallback.xml' },
      'attachment; filename="response.xml"',
      'explicit.xml',
    ],
  ])('saves a response with filename options %j and disposition %s', (values, disposition, expectedFilename) => {
    const blob = new Blob(['<root />'], { type: 'application/xml' });
    const headers = disposition ? new HttpHeaders({ 'Content-Disposition': disposition }) : undefined;
    service.saveResponse(new HttpResponse({ body: blob, headers }), options(values));

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
    expect(savedFiles[0].filename).toBe(expectedFilename);
  });

  it.each(['application/xml', 'APPLICATION/XML'])('retains Blob identity when MIME type %s matches', (mimeType) => {
    const blob = new Blob(['<root />'], { type: 'application/xml' });
    service.saveFile(blob, options({ mimeType }));
    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
  });

  it.each([
    { originalType: 'application/octet-stream', mimeType: 'application/pdf', bytes: new Uint8Array([0, 255, 10, 13]) },
    { originalType: 'text/plain', mimeType: 'text/csv', bytes: new TextEncoder().encode('name,value\r\nmock,1\r\n') },
  ])('changes the MIME label to $mimeType while preserving every byte', async ({ originalType, mimeType, bytes }) => {
    const blob = new Blob([bytes], { type: originalType });
    const headers = new HttpHeaders({ 'Content-Type': 'text/html' });
    service.saveResponse(new HttpResponse({ body: blob, headers }), options({ mimeType }));
    const savedBlob = createObjectURL.mock.calls[0][0] as Blob;

    expect(savedBlob).not.toBe(blob);
    expect(savedBlob.type).toBe(mimeType);
    expect(savedBlob.size).toBe(blob.size);
    expect(Array.from(await readBlob(savedBlob))).toEqual(Array.from(bytes));
    expect(blob.type).toBe(originalType);
  });

  it.each([
    {
      filename: 'report.csv',
      content: 'description,amount\r\nMock fee,£12.34\r\n',
      mimeType: 'text/csv',
      expectedBytes: new TextEncoder().encode('description,amount\r\nMock fee,£12.34\r\n'),
    },
    {
      filename: 'report.pdf',
      content: new TextEncoder().encode('%PDF-1.4\n% synthetic fixture\n%%EOF\n').buffer,
      mimeType: 'application/pdf',
      expectedBytes: new TextEncoder().encode('%PDF-1.4\n% synthetic fixture\n%%EOF\n'),
    },
    {
      filename: 'report.bin',
      content: new Uint8Array([90, 0, 255, 10, 13, 90]).subarray(1, 5),
      mimeType: 'application/octet-stream',
      expectedBytes: new Uint8Array([0, 255, 10, 13]),
    },
  ])(
    'downloads $filename response content using its headers and preserving all bytes',
    async ({ filename, content, mimeType, expectedBytes }) => {
      service.downloadFile(response$, options()).subscribe();
      response$.next(
        new HttpResponse({
          body: content,
          headers: new HttpHeaders({
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          }),
        }),
      );
      response$.complete();
      const blob = createObjectURL.mock.calls[0][0] as Blob;

      expect(savedFiles[0].filename).toBe(filename);
      expect(blob.type).toBe(mimeType);
      expect(Array.from(await readBlob(blob))).toEqual(Array.from(expectedBytes));
    },
  );

  it('creates a Blob from text without forcing a MIME type', async () => {
    const blob = service.createBlob('mock content');

    expect(blob.type).toBe('');
    expect(Array.from(await readBlob(blob))).toEqual(Array.from(new TextEncoder().encode('mock content')));
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('prefers the existing Blob MIME type to a different response header', () => {
    const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    service.saveResponse(
      new HttpResponse({ body: blob, headers: new HttpHeaders({ 'Content-Type': 'text/csv' }) }),
      options(),
    );

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
  });

  it('uses the response MIME header when a Blob has no MIME type', async () => {
    const bytes = new Uint8Array([0, 255, 10, 13]);
    const blob = new Blob([bytes]);
    service.saveResponse(
      new HttpResponse({ body: blob, headers: new HttpHeaders({ 'Content-Type': 'application/pdf' }) }),
      options(),
    );
    const savedBlob = createObjectURL.mock.calls[0][0] as Blob;

    expect(savedBlob.type).toBe('application/pdf');
    expect(Array.from(await readBlob(savedBlob))).toEqual(Array.from(bytes));
    expect(blob.type).toBe('');
  });

  it('rejects a missing response body through both service entrypoints before changing the caller anchor', () => {
    for (const fileService of [service, TestBed.inject(PackagedFileService)]) {
      expect(() => fileService.saveResponse(new HttpResponse<Blob>({ body: null }), options())).toThrow(
        'File content is unavailable.',
      );
    }
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(savedFiles).toEqual([]);
    expect(link.getAttribute('href')).toBeNull();
    expect(link.isConnected).toBe(true);
  });

  it('allows a zero-byte file', () => {
    const blob = new Blob([]);
    service.saveResponse(new HttpResponse({ body: blob }), options({ filename: 'empty.xml' }));

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
    expect(savedFiles[0].filename).toBe('empty.xml');
  });

  it('accepts an empty text response as a zero-byte file', () => {
    service.saveResponse(
      new HttpResponse({ body: '', headers: new HttpHeaders({ 'Content-Type': 'text/csv' }) }),
      options({ filename: 'empty.csv' }),
    );
    const blob = createObjectURL.mock.calls[0][0] as Blob;

    expect(blob.size).toBe(0);
    expect(blob.type).toBe('text/csv');
    expect(savedFiles[0].filename).toBe('empty.csv');
  });

  it('restores the exact existing href and download attributes after saving', () => {
    link.setAttribute('href', '/original/path?query=1');
    link.setAttribute('download', 'original-name.csv');
    service.saveFile('mock', options({ filename: 'new-name.csv' }));

    expect(savedFiles).toEqual([{ filename: 'new-name.csv', href: 'blob:mock-download' }]);
    expect(link.getAttribute('href')).toBe('/original/path?query=1');
    expect(link.getAttribute('download')).toBe('original-name.csv');
    expect(link.isConnected).toBe(true);
  });

  it('restores the caller anchor and releases the object URL when starting the download fails', () => {
    link.setAttribute('href', '/original/path');
    link.setAttribute('download', 'original.xml');
    const error = new Error('Download could not start.');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementationOnce(() => {
      throw error;
    });

    expect(() => service.saveFile(new Blob(['mock']), options({ filename: 'mock.xml' }))).toThrow(error);
    expect(link.getAttribute('href')).toBe('/original/path');
    expect(link.getAttribute('download')).toBe('original.xml');
    expect(link.isConnected).toBe(true);
    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.runOnlyPendingTimers();
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:mock-download');
  });

  it.each(['saveFile', 'saveResponse', 'downloadFile'] as const)(
    'prevents the supplied event synchronously and exactly once when calling %s',
    (method) => {
      const event = new MouseEvent('click', { cancelable: true });
      const preventDefault = vi.spyOn(event, 'preventDefault');
      const values = options({ event });
      const content = new Blob(['mock']);
      if (method === 'saveFile') {
        service.saveFile(content, values);
      } else if (method === 'saveResponse') {
        service.saveResponse(new HttpResponse({ body: content }), values);
      } else {
        const download$ = service.downloadFile(response$, values);
        expect(event.defaultPrevented).toBe(true);
        expect(savedFiles).toEqual([]);
        download$.subscribe();
        response$.next(new HttpResponse({ body: content }));
      }

      expect(event.defaultPrevented).toBe(true);
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(savedFiles).toHaveLength(1);
    },
  );

  it('downloads a supplied response only after subscription and forwards download options', () => {
    const next = vi.fn();
    const download$ = service.downloadFile(response$, options({ filename: 'report.pdf', mimeType: 'application/pdf' }));
    expect(response$.observed).toBe(false);
    expect(createObjectURL).not.toHaveBeenCalled();

    download$.subscribe(next);
    response$.next(new HttpResponse({ body: new Blob(['mock']) }));
    response$.complete();

    expect((createObjectURL.mock.calls[0][0] as Blob).type).toBe('application/pdf');
    expect(savedFiles[0].filename).toBe('report.pdf');
    expect(next).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it('passes supplied response failures to the caller without changing the anchor', () => {
    const error = new HttpErrorResponse({ status: 404 });
    const handleError = vi.fn();
    service.downloadFile(response$, options()).subscribe({ error: handleError });
    response$.error(error);

    expect(handleError).toHaveBeenCalledExactlyOnceWith(error);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('download')).toBeNull();
  });

  it('passes a missing response body failure to the caller', () => {
    const handleError = vi.fn();
    service.downloadFile(response$, options()).subscribe({ error: handleError });
    response$.next(new HttpResponse<Blob>({ body: null }));

    expect(handleError).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('cancels the supplied response subscription without saving when the caller unsubscribes', () => {
    const subscription = service.downloadFile(response$, options()).subscribe();
    subscription.unsubscribe();
    response$.next(new HttpResponse({ body: new Blob(['mock']) }));

    expect(response$.observed).toBe(false);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(savedFiles).toEqual([]);
  });

  it.each([
    {
      responseType: 'blob' as const,
      content: new Blob(['<root />'], { type: 'application/xml' }),
      headerMimeType: 'application/xml',
      mimeType: 'application/octet-stream',
      filename: 'original.xml',
      bytes: new TextEncoder().encode('<root />'),
    },
    {
      responseType: 'arraybuffer' as const,
      content: new Uint8Array(new TextEncoder().encode('%PDF-1.4\n%%EOF\n')).buffer,
      headerMimeType: 'application/pdf',
      mimeType: 'application/pdf',
      filename: 'report.pdf',
      bytes: new TextEncoder().encode('%PDF-1.4\n%%EOF\n'),
    },
    {
      responseType: 'text' as const,
      content: 'amount\r\n£12.34\r\n',
      headerMimeType: 'text/plain',
      mimeType: 'text/csv',
      filename: 'report.csv',
      bytes: new TextEncoder().encode('amount\r\n£12.34\r\n'),
    },
  ])(
    'GETs and saves a $responseType URL response with caller request options',
    async ({ responseType, content, headerMimeType, mimeType, filename, bytes }) => {
      const context = new HttpContext();
      const event = new MouseEvent('click', { cancelable: true });
      const preventDefault = vi.spyOn(event, 'preventDefault');
      const download$ = service.downloadFile(
        '/downloads/report',
        options({
          event,
          responseType,
          headers: { Accept: headerMimeType, 'X-Download-Test': 'mock' },
          params: { businessUnit: 77, includeArchived: false, tags: ['one', 'two'] },
          context,
          withCredentials: true,
          mimeType,
        }),
      );

      expect(event.defaultPrevented).toBe(true);
      httpMock.expectNone('/downloads/report');
      download$.subscribe();
      const req = httpMock.expectOne((request) => request.url === '/downloads/report');
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
      expect(req.request.responseType).toBe(responseType);
      expect(req.request.headers.get('Accept')).toBe(headerMimeType);
      expect(req.request.headers.get('X-Download-Test')).toBe('mock');
      expect(req.request.params.get('businessUnit')).toBe('77');
      expect(req.request.params.get('includeArchived')).toBe('false');
      expect(req.request.params.getAll('tags')).toEqual(['one', 'two']);
      expect(req.request.context).toBe(context);
      expect(req.request.withCredentials).toBe(true);
      req.flush(content, {
        headers: { 'Content-Type': headerMimeType, 'Content-Disposition': `attachment; filename="${filename}"` },
      });
      const blob = createObjectURL.mock.calls[0][0] as Blob;

      expect(blob.type).toBe(mimeType);
      expect(Array.from(await readBlob(blob))).toEqual(Array.from(bytes));
      expect(savedFiles[0].filename).toBe(filename);
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(link.getAttribute('href')).toBeNull();
      expect(link.getAttribute('download')).toBeNull();
    },
  );

  it('defaults URL requests to Blob responses and accepts HttpHeaders and HttpParams', () => {
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    const params = new HttpParams().set('reportId', '123');
    service.downloadFile('/downloads/report', options({ headers, params })).subscribe();
    const req = httpMock.expectOne('/downloads/report?reportId=123');
    expect(req.request.responseType).toBe('blob');
    expect(req.request.headers).toBe(headers);
    expect(req.request.params).toBe(params);
    const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    req.flush(blob);

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
  });

  it('downloads original binary bytes and uses the metadata filename through the public service entrypoint', () => {
    const packagedService = TestBed.inject(PackagedFileService);
    packagedService
      .downloadFile(
        '/downloads/public-api',
        options({
          headers: { Accept: 'application/octet-stream' },
          fallbackFilename: 'original.xml',
        }),
      )
      .subscribe();

    const request = httpMock.expectOne('/downloads/public-api');
    expect(request.request.method).toBe('GET');
    expect(request.request.body).toBeNull();
    expect(request.request.responseType).toBe('blob');
    expect(request.request.headers.get('Accept')).toBe('application/octet-stream');
    const blob = new Blob(['<root />'], { type: 'application/octet-stream' });
    request.flush(blob, { headers: { 'Content-Type': 'application/octet-stream' } });

    expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
    expect(savedFiles).toEqual([{ filename: 'original.xml', href: 'blob:mock-download' }]);
    expect(link.isConnected).toBe(true);
  });

  it('passes URL request failures to the caller without changing the supplied anchor', () => {
    link.setAttribute('href', '/unchanged');
    link.setAttribute('download', 'unchanged.csv');
    const handleError = vi.fn();
    service.downloadFile('/downloads/missing', options()).subscribe({ error: handleError });
    const req = httpMock.expectOne('/downloads/missing');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(handleError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ status: 404 }));
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(link.getAttribute('href')).toBe('/unchanged');
    expect(link.getAttribute('download')).toBe('unchanged.csv');
  });

  it('cancels a URL request when the caller unsubscribes without changing the supplied anchor', () => {
    const subscription = service.downloadFile('/downloads/report', options()).subscribe();
    const req = httpMock.expectOne('/downloads/report');
    subscription.unsubscribe();

    expect(req.cancelled).toBe(true);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(savedFiles).toEqual([]);
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('download')).toBeNull();
    expect(link.isConnected).toBe(true);
  });
});
