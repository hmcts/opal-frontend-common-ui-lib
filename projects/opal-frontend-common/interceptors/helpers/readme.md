# HTTP interceptor helpers

`uploadProgressHttpBackendFactory` selects XHR for browser requests with `reportProgress: true`, allowing measured upload
progress. Other requests use Fetch. Register it only in the upload feature's route providers; keep the application's
root HTTP configuration on Fetch.

The following example assumes an existing standalone `UploadComponent` that displays upload failures beside each file.
Its route has an independent HTTP client with digest, retry and DI interceptors. It omits the application's global error
presenter so failures reach the file list without a global banner or navigation:

```ts
import {
  HttpBackend,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { Routes } from '@angular/router';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { uploadProgressHttpBackendFactory } from '@hmcts/opal-frontend-common/interceptors/helpers';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { UploadComponent } from './upload.component';

export const routes: Routes = [
  {
    path: 'upload',
    component: UploadComponent,
    providers: [
      provideHttpClient(
        withFetch(),
        withInterceptors([contentDigestInterceptor, httpRetryInterceptor]),
        withInterceptorsFromDi(),
      ),
      { provide: HttpBackend, useFactory: uploadProgressHttpBackendFactory },
      OpalFileHandlingService,
    ],
  },
];
```

Keep this configuration in the upload route's own providers and leave the root HTTP configuration unchanged. The route
chooses which interceptor functions run; the backend factory only selects the transport and does not change error
handling. Consumers that require global error presentation can include their application's error interceptor locally.

Providing `OpalFileHandlingService` locally is essential: its default root-provided instance uses the root `HttpClient`.
Other root-provided services continue using the root client unless they are also provided locally. Route providers
create an environment injector; `provideHttpClient(...)` cannot be placed in a component's ordinary `providers` array.

`provideHttpClient(...)` installs XSRF handling automatically. The scoped client inherits the root's XSRF enabled setting
and cookie/header names unless the feature explicitly overrides them, so repeating `withXsrfConfiguration(...)` is
unnecessary. Custom application interceptor functions still need local registration because this client has its own
interceptor chain.

The scoped client runs that chain before selecting the transport, retaining configured authentication headers and XSRF
protection. It does not delegate through a second root HTTP chain. Do not use
`withRequestsMadeViaParent()` here: delegation would use the root transport, and Angular 21 does not allow combining it
with `withFetch()` in one `provideHttpClient(...)` call.

- Within the scoped browser client, requests with `reportProgress: true` use `HttpXhrBackend`; other requests use
  `FetchBackend`. This includes download requests that ask for progress.
- On the server, the factory returns the exact injected `FetchBackend` instance without creating an XHR backend.
- Keep `withFetch()` to provide `FetchBackend`, and register the backend override after the scoped HTTP providers.
- Set `observe: 'events'` and `reportProgress: true` when consuming upload progress. Angular's Fetch backend does not
  emit upload progress events.

The selector adds no retries, validation, cancellation policy or upload UI; these remain with the application and its
HTTP configuration.
