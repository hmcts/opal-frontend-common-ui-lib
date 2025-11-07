import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GENERIC_HTTP_ERROR_MESSAGE } from './constants/http-error-message.constant';
import { IErrorResponse } from './interfaces/http-error-retrievable-error-response.interface';
import { ERROR_RESPONSE } from './constants/http-error-message-response.constant';
/**
 * Checks if the error is a non-retriable error
 * @param error - The HTTP error response
 * @returns true if the error has retriable: false
 */
function isNonRetriableError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const err = error as { error?: { retriable?: boolean } };
    return err.error?.retriable === false;
  }
  return false;
}

/**
 * Checks if the error is explicitly marked as retriable
 * @param error - The HTTP error response
 * @returns true if the error has retriable: true or retriable is undefined
 */
function isRetriableError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const err = error as { error?: { retriable?: boolean } };
    return err.error?.retriable !== false;
  }
  return false;
}

/**
 * Handles retriable errors by setting appropriate error state
 * @param error - The HTTP error response
 * @param globalStore - Global store instance
 */
function handleRetriableError(error: unknown, globalStore: GlobalStoreType): void {
  let errorResponse: IErrorResponse | undefined;

  if (typeof error === 'object' && error !== null && 'error' in error) {
    const err = error as { error?: IErrorResponse };
    errorResponse = err.error;
  }

  const errorMessage = errorResponse?.detail || GENERIC_HTTP_ERROR_MESSAGE;

  globalStore.setError({
    ...GLOBAL_ERROR_STATE,
    error: true,
    title: errorResponse?.title || ERROR_RESPONSE.title,
    message: errorMessage,
    operationId: errorResponse?.operation_id || ERROR_RESPONSE.operation_id,
  });
}

/**
 * Handles non-retriable errors by redirecting to appropriate error pages
 * @param error - The HTTP error response
 * @param router - Angular Router instance
 * @param globalStore - Global store instance
 */
function handleNonRetriableError(error: unknown, router: Router, globalStore: GlobalStoreType): void {
  let errorResponse: IErrorResponse | undefined;
  let status: number | undefined;

  if (typeof error === 'object' && error !== null) {
    if ('error' in error) {
      const err = error as { error?: IErrorResponse };
      errorResponse = err.error;
    }
    if ('status' in error) {
      const statusErr = error as { status?: number };
      status = statusErr.status;
    }
  }

  const statusCode = status || errorResponse?.status;

  // When handling non-retriable errors, we set the error state before navigation
  // However, we do not set error: true as we are navigating to a dedicated error page
  globalStore.setError({
    ...GLOBAL_ERROR_STATE,
    title: errorResponse?.title || ERROR_RESPONSE.title,
    message: errorResponse?.detail || GENERIC_HTTP_ERROR_MESSAGE,
    operationId: errorResponse?.operation_id || ERROR_RESPONSE.operation_id,
  });

  switch (statusCode) {
    case 409:
      router.navigate(['/error/concurrency-failure']);
      break;
    case 403:
      router.navigate(['/error/permission-denied']);
      break;
    default:
      router.navigate(['/error/internal-server']);
      break;
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);
  const appInsightsService = inject(AppInsightsService);
  const router = inject(Router);

  return next(req).pipe(
    tap(() => {
      globalStore.setError({ ...GLOBAL_ERROR_STATE, error: false });
    }),
    catchError((error) => {
      const isBrowser = typeof globalThis !== 'undefined';

      if (isBrowser) {
        if (isNonRetriableError(error)) {
          handleNonRetriableError(error, router, globalStore);
        } else if (isRetriableError(error)) {
          handleRetriableError(error, globalStore);
        } else {
          globalStore.setError({
            ...GLOBAL_ERROR_STATE,
            error: true,
            title: 'There was a problem',
            message: GENERIC_HTTP_ERROR_MESSAGE,
            operationId: ERROR_RESPONSE.operation_id,
          });
        }
      }

      // Always log exceptions for monitoring
      appInsightsService.logException(error);

      return throwError(() => error);
    }),
  );
};
