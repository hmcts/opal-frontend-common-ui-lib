import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GENERIC_HTTP_ERROR_MESSAGE } from './constants/http-error-message.constant';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);
  const appInsightsService = inject(AppInsightsService);

  return next(req).pipe(
    tap(() => {
      // Clear the state service on new requests
      globalStore.setError({ error: false, message: '' });
    }),
    catchError((error) => {
      const isBrowser = typeof window !== 'undefined';

      if (isBrowser) {
        globalStore.setError({
          error: true,
          message: GENERIC_HTTP_ERROR_MESSAGE,
        });
      }

      appInsightsService.logException(error);

      return throwError(() => error);
    }),
  );
};
