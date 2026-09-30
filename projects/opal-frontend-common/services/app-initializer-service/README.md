# OPAL application initializer

`provideOpalAppInitializer()` registers the shared OPAL application initializer with Angular.

## Registration

Register the provider once in the application's `ApplicationConfig`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideOpalAppInitializer } from '@hmcts/opal-frontend-common/services/app-initializer-service';

export const appConfig: ApplicationConfig = {
  providers: [provideOpalAppInitializer()],
};
```

## Initialisation behaviour

The provider returns the asynchronous `AppInitializerService.initializeApp()` promise to Angular. Angular waits for
that promise before completing application startup.

This makes the server-provided Application Insights configuration available and loads browser Application Insights
before initial application HTTP requests run. Those requests can then include trace context for end-to-end request
breakdown in Application Insights.

The initializer runs only when the `serverTransferState` key is present. That key is populated by an SSR response.
Browser-only `ng serve` does not produce it, so the provider safely skips initialisation in that mode rather than
attempting to read unavailable server configuration.
