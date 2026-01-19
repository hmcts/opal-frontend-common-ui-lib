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
import { SKIP_HTTP_ERROR_HANDLER } from '@hmcts/opal-frontend-common/interceptors/http-error/constants';
import { ISkipErrorHandlerCondition } from 'dist/opal-frontend-common/types/hmcts-opal-frontend-common-interceptors-http-error-interfaces';

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

  globalStore.setBannerError({
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
 */
function handleNonRetriableError(error: unknown, router: Router): void {
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

  const operationId = errorResponse?.operation_id || ERROR_RESPONSE.operation_id;

  switch (statusCode) {
    case 409:
      router.navigate(['/error/concurrency-failure']);
      break;
    case 403:
      router.navigate(['/error/permission-denied']);
      break;
    default:
      router.navigate(['/error/internal-server'], {
        state: { operationId },
      });
      break;
  }
}

/**
 * Handles bypass of standard error handling based on request context
 * @param error - The HTTP error response
 * @param reqContext - The error handling exception condition context
 * @param globalStore - Global store instance
 * @returns true if the error handling exception condition is met, otherwise false
 */
function handleBypassErrorHandling(
  error: unknown,
  reqContext: ISkipErrorHandlerCondition,
  globalStore: GlobalStoreType,
) {
  const customErrorMessageKey = reqContext.customErrorMessageKey as keyof IErrorResponse;
  let errorResponse: IErrorResponse | undefined;
  let customMessage: string | undefined;
  if (typeof error === 'object' && error !== null) {
    if ('error' in error) {
      const err = error as { error?: IErrorResponse };
      errorResponse = err.error;
      if (errorResponse && customErrorMessageKey) {
        customMessage = errorResponse[customErrorMessageKey]?.toString();
      }
    }
  }
  globalStore.setBannerError({
    ...GLOBAL_ERROR_STATE,
    error: true,
    title: 'There was a problem',
    message: customMessage || GENERIC_HTTP_ERROR_MESSAGE,
    operationId: errorResponse?.operation_id || ERROR_RESPONSE.operation_id,
  });
}

/**
 * Checks if there is an error handling exception condition which is met
 * @param error - The HTTP error response
 * @param reqContext - The error handling exception condition context
 * @returns true if the error handling exception condition is met, otherwise false
 */
function isErrorHandlingExceptionMet(error: unknown, reqContext: ISkipErrorHandlerCondition): boolean {
  let errorResponse: IErrorResponse | undefined;

  if (typeof error === 'object' && error !== null) {
    if ('error' in error) {
      const err = error as { error?: IErrorResponse };
      errorResponse = err.error;
    }
  }

  if (errorResponse && errorResponse[reqContext?.key as keyof IErrorResponse] === reqContext?.value) {
    return true;
  }

  return false;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);
  const appInsightsService = inject(AppInsightsService);
  const router = inject(Router);

  return next(req).pipe(
    tap(() => {
      globalStore.resetBannerError();
    }),
    catchError((error) => {
      const isBrowser = typeof globalThis !== 'undefined';

      if (isBrowser) {
        // Bypass error handling if exception condition is met
        const reqContext = req.context.get(SKIP_HTTP_ERROR_HANDLER);
        if (reqContext && isErrorHandlingExceptionMet(error, reqContext)) {
          handleBypassErrorHandling(error, reqContext, globalStore);

          // Always log exceptions for monitoring
          appInsightsService.logException(error);

          return throwError(() => error);
        }

        if (isNonRetriableError(error)) {
          handleNonRetriableError(error, router);
        } else if (isRetriableError(error)) {
          handleRetriableError(error, globalStore);
        } else {
          globalStore.setBannerError({
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
