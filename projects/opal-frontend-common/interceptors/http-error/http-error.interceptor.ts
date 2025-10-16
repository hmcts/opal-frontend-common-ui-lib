import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GENERIC_HTTP_ERROR_MESSAGE } from './constants/http-error-message.constant';
import { ErrorResponse } from './interface/http-error-retrievable-error-response.interface';

/**
 * Checks if the error is a non-retriable error
 * @param error - The HTTP error response
 * @returns true if the error has retriable: false
 */
function isNonRetriableError(error: any): boolean {
  return error?.error?.retriable === false;
}

/**
 * Checks if the error is explicitly marked as retriable
 * @param error - The HTTP error response
 * @returns true if the error has retriable: true or retriable is undefined
 */
function isRetriableError(error: any): boolean {
  const retriable = error?.error?.retriable;
  return retriable === true || retriable === undefined;
}

/**
 * Handles retriable errors by setting appropriate error state
 * @param error - The HTTP error response
 * @param globalStore - Global store instance
 */
function handleRetriableError(error: any, globalStore: any): void {
  const errorResponse: ErrorResponse = error?.error;
  const errorMessage = errorResponse?.detail || GENERIC_HTTP_ERROR_MESSAGE;

  globalStore.setError({
    error: true,
    title: errorResponse?.title || 'There was a problem',
    message: errorMessage,
    operationId: errorResponse?.operation_id || null,
  });
}

/**
 * Handles non-retriable errors by redirecting to appropriate error pages
 * @param error - The HTTP error response
 * @param router - Angular Router instance
 */
function handleNonRetriableError(error: any, router: Router): void {
  const errorResponse: ErrorResponse = error?.error;
  const statusCode = error?.status || errorResponse?.status;

  switch (statusCode) {
    case 409:
      router.navigate(['/error/concurrency-failure']);
      break;
    case 403:
      router.navigate(['/error/permission-denied']);
      break;
    default:
      router.navigate(['/error/internal-server-error']);
      break;
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);
  const appInsightsService = inject(AppInsightsService);
  const router = inject(Router);

  return next(req).pipe(
    tap(() => {
      globalStore.setError({ error: false, title: '', message: '', operationId: null });
    }),
    catchError((error) => {
      const isBrowser = typeof globalThis !== 'undefined';

      if (isBrowser) {
        if (isNonRetriableError(error)) {
          handleNonRetriableError(error, router);
        } else if (isRetriableError(error)) {
          handleRetriableError(error, globalStore);
        } else {
          globalStore.setError({
            error: true,
            title: 'There was a problem',
            message: GENERIC_HTTP_ERROR_MESSAGE,
            operationId: null,
          });
        }
      }

      // Always log exceptions for monitoring
      appInsightsService.logException(error);

      return throwError(() => error);
    }),
  );
};
