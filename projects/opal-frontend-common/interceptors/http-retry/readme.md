# HTTP Retry Interceptor

`httpRetryInterceptor` retries opted-in GET requests only when they fail with configured transient HTTP errors.

Use this interceptor when a request can safely be retried and the consuming feature wants request-level control over the retry policy.

## Installation

```typescript
import {
  httpRetryInterceptor,
  withHttpRetry,
  withoutHttpRetry,
} from '@hmcts/opal-frontend-common/interceptors/http-retry';
```

Register the interceptor in the consuming app's providers:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';

export const appConfig = {
  providers: [provideHttpClient(withInterceptors([httpRetryInterceptor]))],
};
```

## Usage

Retry is disabled by default. Add `withHttpRetry` to the request context to opt in a single request.

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { withHttpRetry } from '@hmcts/opal-frontend-common/interceptors/http-retry';

export class AccountService {
  private readonly httpClient = inject(HttpClient);

  public getAccount(accountId: string) {
    return this.httpClient.get(`/api/accounts/${accountId}`, {
      context: withHttpRetry({
        retryCount: 2,
        delayMs: 250,
        backoffMultiplier: 2,
        maxDelayMs: 1000,
      }),
    });
  }
}
```

Use `withoutHttpRetry` when a request should explicitly disable retry on an existing context.

```typescript
import { withoutHttpRetry } from '@hmcts/opal-frontend-common/interceptors/http-retry';

const context = withoutHttpRetry(existingContext);
```

## Request Eligibility

- Retry only applies to `GET` requests.
- `POST`, `PUT`, `PATCH`, and `DELETE` requests are ignored by the interceptor, even when `withHttpRetry` is present.
- Retry is disabled by default and must be opted in per request.

## Retry Policy

| Option                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `retryCount`           | Number of retry attempts. Values are capped at `2`.      |
| `delayMs`              | Initial delay before retrying. Values are capped at 30s. |
| `backoffMultiplier`    | Multiplier applied to each retry delay.                  |
| `maxDelayMs`           | Maximum delay between retry attempts.                    |
| `retryableStatusCodes` | Supported retryable statuses to retry for this request.  |

Retry is only attempted for `GET` requests.

The supported retryable statuses are `0`, `408`, `502`, `503` and `504`. Statuses `400`, `401`, `403`, `404`, `409` and `422` are never retried.

If an API error body includes `retriable: false`, the interceptor does not retry the request.

## Testing

Unit tests for this interceptor are located in the `http-retry.interceptor.spec.ts` file.

```bash
yarn test
```
