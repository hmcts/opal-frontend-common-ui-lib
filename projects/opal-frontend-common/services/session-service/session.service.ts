import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, retry, shareReplay, tap, timer } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_ENDPOINTS } from '@hmcts/opal-frontend-common/services/session-service/constants';
import {
  ISessionUserState,
  ISessionTokenExpiry,
} from '@hmcts/opal-frontend-common/services/session-service/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);
  private userStateCache$!: Observable<ISessionUserState>;
  private tokenExpiryCache$!: Observable<ISessionTokenExpiry>;

  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 1000;

  /**
   * Retrieves the user state from the backend.
   * If the user state is not available or needs to be refreshed, it makes an HTTP request to fetch the user state.
   * The user state is then stored in the state service for future use.
   * The user state is cached using the `shareReplay` operator to avoid unnecessary HTTP requests.
   * @returns An observable that emits the user state.
   */
  public getUserState(): Observable<ISessionUserState> {
    // The backend can return an empty object so...
    // If we don't have a user state, then we need to refresh it...
    // And override the shareReplay cache...
    const refresh = !this.globalStore.userState()?.user_id;

    if (!this.userStateCache$ || refresh) {
      this.userStateCache$ = this.http
        .get<ISessionUserState>(SESSION_ENDPOINTS.userState)
        .pipe(shareReplay(1))
        .pipe(
          tap((userState) => {
            this.globalStore.setUserState(userState);
          }),
        );
    }

    return this.userStateCache$;
  }

  /**
   * Retrieves the token expiry information from the server.
   * If the token expiry information is already cached, it returns the cached value.
   * Otherwise, it makes an HTTP GET request to fetch the token expiry information,
   * retries the request up to a maximum number of times if it fails, and caches the result.
   *
   * @returns {Observable<ISessionTokenExpiry>} An observable that emits the token expiry information.
   */
  public getTokenExpiry(): Observable<ISessionTokenExpiry> {
    this.tokenExpiryCache$ ??= this.http.get<ISessionTokenExpiry>(SESSION_ENDPOINTS.expiry).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: () => timer(this.RETRY_DELAY_MS),
      }),
      tap((expiry) => {
        this.globalStore.setTokenExpiry(expiry);
      }),
      shareReplay(1),
    );
    return this.tokenExpiryCache$;
  }
}
