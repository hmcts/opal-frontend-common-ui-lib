import { HttpEvent, HttpEventType, HttpHandlerFn, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contentDigestInterceptor } from './content-digest.interceptor';

async function computeSha512Digest(body: unknown): Promise<string> {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  if (typeof bodyString !== 'string') {
    throw new TypeError('Tests require serializable JSON input.');
  }

  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(bodyString);
  const cryptoApi = (globalThis as { crypto?: Crypto }).crypto;
  if (!cryptoApi?.subtle) {
    throw new Error('Web Crypto API is not available during tests.');
  }

  const digest = await cryptoApi.subtle.digest('SHA-512', bytes);
  const digestBytes = new Uint8Array(digest);

  if (typeof btoa === 'function') {
    let binary = '';
    for (const value of digestBytes) {
      binary += String.fromCodePoint(value);
    }
    return btoa(binary);
  }

  const bufferCtor = (globalThis as { Buffer?: { from(input: Uint8Array): { toString(encoding: 'base64'): string } } })
    .Buffer;
  if (bufferCtor) {
    return bufferCtor.from(digestBytes).toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this test environment.');
}

function callInterceptor(
  req: HttpRequest<unknown>,
  handler: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>,
) {
  const httpHandler: HttpHandlerFn = (outReq) => handler(outReq);
  return contentDigestInterceptor(req, httpHandler);
}

describe('contentDigestInterceptor (requests)', () => {
  it('hashes JSON object bodies and sets digest headers', async () => {
    const body = { message: 'opal' };
    const expectedDigest = await computeSha512Digest(body);
    const response = new HttpResponse({ body: null });

    await firstValueFrom(
      callInterceptor(new HttpRequest('POST', '/test', body), (outReq) => {
        expect(outReq.body).toBe(JSON.stringify(body));
        expect(outReq.headers.get('Content-Digest')).toBe(`sha-512=:${expectedDigest}:`);
        expect(outReq.headers.get('Want-Content-Digest')).toBe('sha-512');
        expect(outReq.headers.get('Content-Type')).toBe('application/json');
        return of(response);
      }),
    );
  });

  it('hashes JSON string bodies when the content type is declared', async () => {
    const body = '{"raw":true}';
    const expectedDigest = await computeSha512Digest(body);
    const request = new HttpRequest('PUT', '/test', body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
    const response = new HttpResponse({ body: null });

    await firstValueFrom(
      callInterceptor(request, (outReq) => {
        expect(outReq.body).toBe(body);
        expect(outReq.headers.get('Content-Digest')).toBe(`sha-512=:${expectedDigest}:`);
        expect(outReq.headers.get('Content-Type')).toBe('application/json');
        return of(response);
      }),
    );
  });

  it('skips hashing for GET requests but still asks for a digest', async () => {
    const response = new HttpResponse({
      body: null,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });

    const result = await firstValueFrom(
      callInterceptor(new HttpRequest('GET', '/test'), (outReq) => {
        expect(outReq.headers.get('Want-Content-Digest')).toBe('sha-512');
        expect(outReq.headers.has('Content-Digest')).toBe(false);
        expect(outReq.body == null).toBe(true);
        return of(response);
      }),
    );

    expect(result).toBe(response);
  });

  it('skips hashing for FormData payloads', async () => {
    const payload = new FormData();
    payload.append('file', new Blob(['content']));
    const response = new HttpResponse({ body: null });

    await firstValueFrom(
      callInterceptor(new HttpRequest('POST', '/upload', payload), (outReq) => {
        expect(outReq.headers.get('Want-Content-Digest')).toBe('sha-512');
        expect(outReq.headers.has('Content-Digest')).toBe(false);
        expect(outReq.body).toBe(payload);
        return of(response);
      }),
    );
  });
});

describe('contentDigestInterceptor (response validation)', () => {
  it('passes through non-response events unchanged', async () => {
    const sentEvent: HttpEvent<unknown> = { type: HttpEventType.Sent };
    const initialRequest = new HttpRequest('POST', '/test', {});

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(sentEvent)));

    expect(result).toBe(sentEvent);
  });

  it('passes through JSON responses when the digest matches', async () => {
    const body = { success: true };
    const digest = await computeSha512Digest(body);
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-512=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('validates digest when the JSON body is undefined', async () => {
    const digest = await computeSha512Digest(null);
    const response = new HttpResponse({
      body: undefined,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-512=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', {});

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('validates digest when the JSON body is already a string', async () => {
    const body = '{"raw":true}';
    const digest = await computeSha512Digest(body);
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-512=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', {});

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('throws when the response digest does not match the payload', async () => {
    const body = { name: 'opal' };
    const digest = await computeSha512Digest({ name: 'expected' });
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-512=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    await expect(firstValueFrom(callInterceptor(initialRequest, () => of(response)))).rejects.toThrow(
      'Response content digest mismatch detected.',
    );
  });

  it('throws when the Content-Digest header is malformed', async () => {
    const body = { status: 'ok' };
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': 'sha-512=abc',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    await expect(firstValueFrom(callInterceptor(initialRequest, () => of(response)))).rejects.toThrow(
      'Malformed Content-Digest header: missing sha-512 entry.',
    );
  });

  it('ignores responses without a Content-Digest header', async () => {
    const body = { done: true };
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('ignores non-JSON responses even when Content-Digest is present', async () => {
    const body = '<html/>';
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'text/html',
        'Content-Digest': 'sha-512=:not-checked:',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('throws when the response body cannot be serialized to JSON', async () => {
    const response = new HttpResponse({
      body: Symbol('unserializable') as unknown,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': 'sha-512=:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=:',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', {});

    const promise = firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    await expect(promise).rejects.toThrow(TypeError);
    await expect(promise).rejects.toThrow('Unable to serialize JSON response body for digest verification.');
  });
});

describe('contentDigestInterceptor (environment fallbacks)', () => {
  let restoreBtoa: (() => void) | undefined;
  let restoreBuffer: (() => void) | undefined;

  function overrideBtoa(value: typeof btoa | null | undefined): () => void {
    const hadOwn = Object.prototype.hasOwnProperty.call(globalThis, 'btoa');
    const originalValue = (globalThis as Record<string, unknown>)['btoa'];
    Object.defineProperty(globalThis, 'btoa', {
      configurable: true,
      writable: true,
      value,
    });
    return () => {
      if (hadOwn) {
        Object.defineProperty(globalThis, 'btoa', {
          configurable: true,
          writable: true,
          value: originalValue,
        });
      } else {
        delete (globalThis as Record<string, unknown>)['btoa'];
      }
    };
  }

  function overrideBuffer(value: unknown): () => void {
    const hadOwn = Object.prototype.hasOwnProperty.call(globalThis, 'Buffer');
    const originalValue = (globalThis as Record<string, unknown>)['Buffer'];
    Object.defineProperty(globalThis, 'Buffer', {
      configurable: true,
      writable: true,
      value,
    });
    return () => {
      if (hadOwn) {
        Object.defineProperty(globalThis, 'Buffer', {
          configurable: true,
          writable: true,
          value: originalValue,
        });
      } else {
        delete (globalThis as Record<string, unknown>)['Buffer'];
      }
    };
  }

  afterEach(() => {
    vi.restoreAllMocks();

    restoreBtoa?.();
    restoreBtoa = undefined;

    restoreBuffer?.();
    restoreBuffer = undefined;
  });

  it('throws when the Web Crypto API is not available', async () => {
    vi.spyOn(globalThis as Window & typeof globalThis, 'crypto', 'get').mockReturnValue(undefined as unknown as Crypto);
    const request = new HttpRequest('POST', '/test', { value: 1 });

    await expect(
      firstValueFrom(
        callInterceptor(request, () =>
          of(
            new HttpResponse({
              body: null,
              headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }),
          ),
        ),
      ),
    ).rejects.toThrow('Web Crypto API is not available.');
  });

  it('falls back to Buffer when btoa is missing', async () => {
    restoreBtoa = overrideBtoa(undefined);
    const toStringSpy = vi.fn((encoding: string) => {
      expect(encoding).toBe('base64');
      return 'buffer-digest';
    });
    const fromSpy = vi.fn((input: Uint8Array) => {
      expect(input instanceof Uint8Array).toBe(true);
      return { toString: toStringSpy };
    });
    restoreBuffer = overrideBuffer({ from: fromSpy });

    const request = new HttpRequest('POST', '/test', { value: true });

    await firstValueFrom(
      callInterceptor(request, (outReq) => {
        expect(outReq.headers.get('Content-Digest')).toBe('sha-512=:buffer-digest:');
        return of(
          new HttpResponse({
            body: null,
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          }),
        );
      }),
    );

    expect(fromSpy).toHaveBeenCalled();
    expect(toStringSpy).toHaveBeenCalled();
  });

  it('throws when neither btoa nor Buffer are available', async () => {
    restoreBtoa = overrideBtoa(undefined);
    restoreBuffer = overrideBuffer(undefined);

    const request = new HttpRequest('POST', '/test', { missing: true });

    await expect(
      firstValueFrom(
        callInterceptor(request, () =>
          of(
            new HttpResponse({
              body: null,
              headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }),
          ),
        ),
      ),
    ).rejects.toThrow('Base64 encoding is not supported in this environment.');
  });
});
