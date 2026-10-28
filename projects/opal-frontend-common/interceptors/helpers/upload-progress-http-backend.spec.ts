import {
  FetchBackend,
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
  HttpXsrfTokenExtractor,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadProgressHttpBackendFactory } from './upload-progress-http-backend';

describe('uploadProgressHttpBackendFactory', () => {
  const fetchHandle = vi.fn<(request: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>>();
  const xhrHandle = vi.fn<(request: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>>();
  const intercept: HttpInterceptorFn = (request, next) =>
    next(request.clone({ setHeaders: { 'X-Test-Interceptor': 'retained' } }));

  beforeEach(() => {
    fetchHandle.mockReset().mockReturnValue(of(new HttpResponse({ body: { transport: 'fetch' } })));
    xhrHandle.mockReset().mockReturnValue(of(new HttpResponse({ body: { transport: 'xhr' } })));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withFetch(),
          withInterceptors([intercept]),
          withXsrfConfiguration({ headerName: 'X-XSRF-TOKEN', cookieName: 'XSRF-TOKEN' }),
        ),
        { provide: HttpBackend, useFactory: uploadProgressHttpBackendFactory },
        { provide: FetchBackend, useValue: { handle: fetchHandle } },
        { provide: HttpXhrBackend, useValue: { handle: xhrHandle } },
        { provide: HttpXsrfTokenExtractor, useValue: { getToken: () => 'test-xsrf' } },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  });

  it('sends browser uploads through XHR with configured interceptors and XSRF protection', () => {
    const body = new FormData();
    body.append('file', new File(['contents'], 'banking.dat'));
    const next = vi.fn();

    TestBed.inject(HttpClient)
      .post('/interface-files', body, { observe: 'events', reportProgress: true })
      .subscribe(next);

    expect(fetchHandle).not.toHaveBeenCalled();
    expect(xhrHandle).toHaveBeenCalledOnce();
    const request = xhrHandle.mock.calls[0][0];
    expect(request.body).toBe(body);
    expect(request.reportProgress).toBe(true);
    expect(request.headers.get('X-Test-Interceptor')).toBe('retained');
    expect(request.headers.get('X-XSRF-TOKEN')).toBe('test-xsrf');
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ body: { transport: 'xhr' } }));
  });

  it('keeps browser requests without progress on Fetch', () => {
    const next = vi.fn();

    TestBed.inject(HttpClient).get('/interface-files').subscribe(next);

    expect(xhrHandle).not.toHaveBeenCalled();
    expect(fetchHandle).toHaveBeenCalledOnce();
    expect(fetchHandle.mock.calls[0][0].headers.get('X-Test-Interceptor')).toBe('retained');
    expect(next).toHaveBeenCalledWith({ transport: 'fetch' });
  });

  it('forwards upload progress and cancels the selected transport when unsubscribed', () => {
    const events = new Subject<HttpEvent<unknown>>();
    const cancel = vi.fn();
    xhrHandle.mockReturnValue(
      new Observable((subscriber) => {
        const subscription = events.subscribe(subscriber);
        return () => {
          subscription.unsubscribe();
          cancel();
        };
      }),
    );
    const next = vi.fn();
    const subscription = TestBed.inject(HttpClient)
      .post('/interface-files', new FormData(), { observe: 'events', reportProgress: true })
      .subscribe(next);
    const progress: HttpEvent<unknown> = { type: HttpEventType.UploadProgress, loaded: 40, total: 100 };

    events.next(progress);
    expect(next).toHaveBeenCalledWith(progress);

    subscription.unsubscribe();
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('returns the exact Fetch backend on the server without creating an XHR backend', () => {
    const createXhrBackend = vi.fn(() => ({ handle: xhrHandle }));
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    TestBed.overrideProvider(HttpXhrBackend, { useFactory: createXhrBackend });

    expect(TestBed.inject(HttpBackend)).toBe(TestBed.inject(FetchBackend));
    expect(createXhrBackend).not.toHaveBeenCalled();

    TestBed.inject(HttpClient).post('/interface-files', new FormData(), { reportProgress: true }).subscribe();

    expect(fetchHandle).toHaveBeenCalledOnce();
    expect(xhrHandle).not.toHaveBeenCalled();
  });

  it('allows the standard HTTP testing backend to replace both browser transports', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    const httpTesting = TestBed.inject(HttpTestingController);
    const next = vi.fn();

    TestBed.inject(HttpClient).post('/interface-files', new FormData(), { reportProgress: true }).subscribe(next);
    httpTesting.expectOne('/interface-files').flush({ uploaded: true });

    expect(next).toHaveBeenCalledWith({ uploaded: true });
    expect(fetchHandle).not.toHaveBeenCalled();
    expect(xhrHandle).not.toHaveBeenCalled();
    httpTesting.verify();
  });
});
