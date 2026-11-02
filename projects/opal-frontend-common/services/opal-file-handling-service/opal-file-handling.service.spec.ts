import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FILE_HANDLING_PATHS } from './constants/opal-file-handling-paths.constant';
import { IOpalFileHandlingInterfaceFile } from './interfaces/opal-file-handling-interface-file.interface';
import { IOpalFileHandlingInterfaceFilesRefData } from './interfaces/opal-file-handling-interface-files-ref-data.interface';
import { OpalFileHandlingService } from './opal-file-handling.service';

describe('OpalFileHandlingService', () => {
  let service: OpalFileHandlingService;
  let httpMock: HttpTestingController;

  const interfaceFile: IOpalFileHandlingInterfaceFile = {
    interface_file_id: 123,
    file_name: 'mock-interface.xml',
    source: 'ALLPAY',
    target: 'OPAL',
    type: 'SOURCE',
    domain: 'FINES',
    status: 'SUCCESS',
    business_unit_codes: ['001', '002'],
    filestore_uuid: '00000000-0000-4000-8000-000000000123',
    checksum: 'checksum',
    created_datetime: '2026-09-23T10:00:00Z',
    errors: null,
  };

  const interfaceFilesRefData: IOpalFileHandlingInterfaceFilesRefData = {
    number_of_results: 1,
    interface_files: [interfaceFile],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpalFileHandlingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get interface files reference data', () => {
    service.getInterfaceFilesRefData().subscribe((response) => {
      expect(response).toEqual(interfaceFilesRefData);
    });

    const req = httpMock.expectOne(OPAL_FILE_HANDLING_PATHS.interfaceFilesRefData);
    expect(req.request.method).toBe('GET');
    req.flush(interfaceFilesRefData);
  });

  it('serializes CSV lists and scalar targets, omitting empty filters from the list request', () => {
    service
      .getInterfaceFilesRefData({
        domain: 'FINES',
        type: ['SOURCE', '', 'TRANSFORMED_JSON'],
        target: 'OPAL',
        not_status: ['FAILED', '', 'INGESTED'],
        status: undefined,
        business_unit_code: '',
        not_target: 'NATWEST',
      })
      .subscribe();

    const req = httpMock.expectOne((request) => request.url === OPAL_FILE_HANDLING_PATHS.interfaceFilesRefData);
    expect(req.request.params.keys().sort()).toEqual(['domain', 'not_status', 'not_target', 'target', 'type']);
    expect(req.request.params.get('domain')).toBe('FINES');
    expect(req.request.params.get('type')).toBe('SOURCE,TRANSFORMED_JSON');
    expect(req.request.params.getAll('not_status')).toEqual(['FAILED,INGESTED']);
    expect(req.request.params.get('target')).toBe('OPAL');
    expect(req.request.params.get('not_target')).toBe('NATWEST');
    expect(req.request.body).toBeNull();
    req.flush(interfaceFilesRefData);
  });

  it('omits empty array filters from the list request', () => {
    service.getInterfaceFilesRefData({ type: [], not_status: ['', ''] }).subscribe();

    const req = httpMock.expectOne(OPAL_FILE_HANDLING_PATHS.interfaceFilesRefData);
    expect(req.request.params.keys()).toEqual([]);
    req.flush({ number_of_results: 0, interface_files: [] });
  });

  it('should get an interface file by id', () => {
    service.getInterfaceFile(123).subscribe((response) => {
      expect(response).toEqual(interfaceFile);
    });

    const req = httpMock.expectOne('/opal-file-handling-service/interface-files/123');
    expect(req.request.method).toBe('GET');
    req.flush(interfaceFile);
  });

  it.each([
    { format: 'XML', bytes: new TextEncoder().encode('<root />') },
    {
      format: 'XLSX',
      bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
    },
  ])('retrieves original $format bytes as an octet-stream response', ({ bytes }) => {
    const contentType = 'application/octet-stream';
    const content = new Blob([bytes], { type: contentType });

    service.getInterfaceFileContent(123).subscribe((response) => {
      expect(response.body).toBe(content);
      expect(response.body?.type).toBe(contentType);
      expect(response.headers.get('Content-Type')).toBe(contentType);
      expect(response.headers.get('Content-Disposition')).toBeNull();
    });

    const req = httpMock.expectOne('/opal-file-handling-service/interface-files/123/content');
    expect(req.request.method).toBe('GET');
    expect(req.request.body).toBeNull();
    expect(req.request.params.keys()).toEqual([]);
    expect(req.request.responseType).toBe('blob');
    expect(req.request.headers.get('Accept')).toBe('application/octet-stream');
    req.flush(content, { headers: { 'Content-Type': contentType } });
  });
});
