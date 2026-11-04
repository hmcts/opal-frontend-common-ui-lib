import { isPlatformBrowser } from '@angular/common';
import { FetchBackend, HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Selects an HTTP transport after interceptors, preserving Fetch during server rendering.
 * @returns The injected Fetch backend on the server, or a browser backend using XHR for progress requests.
 */
export function uploadProgressHttpBackendFactory(): HttpBackend {
  const fetchBackend = inject(FetchBackend);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return fetchBackend;
  }

  const xhrBackend = inject(HttpXhrBackend);
  return {
    /**
     * Dispatches a browser request through the transport supporting its requested progress events.
     * @param request - HTTP request after the configured interceptor chain.
     * @returns The selected transport's HTTP event stream.
     */
    handle: (request) => (request.reportProgress ? xhrBackend.handle(request) : fetchBackend.handle(request)),
  };
}
