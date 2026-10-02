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
    file_id: 123,
    source: 'source',
    target: 'target',
    type: 'type',
    domain: 'domain',
    status: 'status',
    business_unit_code: 'BU1',
    file_store_uuid: 'file-store-uuid',
    checksum: 'checksum',
    date_and_time: '2026-09-23T10:00:00Z',
    errors: null,
  };

  const interfaceFilesRefData: IOpalFileHandlingInterfaceFilesRefData = {
    count: 1,
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

  it('should get an interface file by id', () => {
    service.getInterfaceFile(123).subscribe((response) => {
      expect(response).toEqual(interfaceFile);
    });

    const req = httpMock.expectOne('/opal-file-handling-service/interface-files/123');
    expect(req.request.method).toBe('GET');
    req.flush(interfaceFile);
  });

  it('should get interface file content as a blob response for XML or XLSX content', () => {
    const content = new Blob(['<root />'], { type: 'application/xml' });

    service.getInterfaceFileContent(123).subscribe((response) => {
      expect(response.body).toEqual(content);
      expect(response.headers.get('Content-Type')).toBe('application/xml');
    });

    const req = httpMock.expectOne('/opal-file-handling-service/interface-files/123/content');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    expect(req.request.headers.get('Accept')).toBe(
      'application/xml, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    req.flush(content, { headers: { 'Content-Type': 'application/xml' } });
  });
});
