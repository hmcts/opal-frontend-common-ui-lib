import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

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
}
