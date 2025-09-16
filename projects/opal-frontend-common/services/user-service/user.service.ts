import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IUserState } from './interfaces/user-state.interface';
import { retry, timer, map, tap, catchError, throwError, Observable } from 'rxjs';
import { USER_ENDPOINTS } from './constants/user-endpoints.constant';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 800;

  public getUserState(): Observable<IUserState> {
    return this.http.get<IUserState>(USER_ENDPOINTS.userState).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: (_err, i) => timer(this.RETRY_DELAY_MS * (i + 1)),
      }),
      // Guard against malformed payloads; do not coerce to a truthy id
      map((u) =>
        u && typeof (u as IUserState).user_id === 'number'
          ? (u as IUserState)
          : ({ ...u, user_id: undefined } as unknown as IUserState),
      ),
      tap((userState) => this.globalStore.setUserState(userState)),
      catchError((err) => {
        if (err?.status === 401) {
          // Clear store so the app knows the session is invalid
          this.globalStore.setUserState(undefined as unknown as IUserState);
          // Optionally redirect to SSO here if desired
          // window.location.href = '/sso/login';
        }
        return throwError(() => err);
      }),
    );
  }
}
