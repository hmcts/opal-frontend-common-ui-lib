import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);
  private readonly opalUserService = inject(OpalUserService);

  public checkAuthenticated() {
    return this.http
      .get<boolean>(SSO_ENDPOINTS.authenticated, {
        headers: new HttpHeaders({
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        }),
      })
      .pipe(
        tap((resp) => {
          this.globalStore.setAuthenticated(resp);
        }),
      )
      .pipe(
        catchError((error) => {
          this.globalStore.setAuthenticated(false);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Ends the current server-side session and clears local authentication and user-state data.
   *
   * The logout endpoint can redirect to an HTML page, so the response is read as text
   * rather than the default JSON response type.
   */
  public logout() {
    this.opalUserService.clearUserStateCache();

    return this.http.get(SSO_ENDPOINTS.logout, { responseType: 'text' }).pipe(
      tap(() => {
        this.globalStore.setAuthenticated(false);
      }),
      map(() => undefined),
      catchError((error) => {
        this.globalStore.setAuthenticated(false);
        return throwError(() => error);
      }),
    );
  }
}
