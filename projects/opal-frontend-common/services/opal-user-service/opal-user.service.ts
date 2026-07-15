import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { catchError, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { OPAL_USER_STATE_RESPONSE_STATUS } from './constants/opal-user-state-response-status.constant';
import { IOpalUserStateResponse } from './interfaces/opal-user-state-response.interface';
import type { OpalUserStateResponseStatus } from './interfaces/opal-user-state-response-status.type';
import type { OpalUserStateStatus } from './interfaces/opal-user-state-status.type';

const USER_STATE_CACHE_TTL_HEADER = 'X-OPAL-User-State-Cache-TTL-Ms';

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);
  private inFlightUserState$?: Observable<IOpalUserState>;
  private userStateCacheExpiresAtMilliseconds = 0;

  private toOpalUserStatus(status: OpalUserStateResponseStatus | null): OpalUserStateStatus | null {
    return status ? OPAL_USER_STATE_RESPONSE_STATUS[status] : null;
  }

  private getUserStateDomain(): string {
    const userStateDomain = this.globalStore.userStateDomain();
    if (typeof userStateDomain === 'string' && userStateDomain.trim()) {
      return userStateDomain.trim();
    }

    throw new Error('User state domain is required before loading user permissions.');
  }

  /**
   * Maps the Redis-backed user state response into the existing domain-specific user state shape.
   */
  private toOpalUserState(userState: IOpalUserStateResponse): IOpalUserState {
    const userStateDomain = this.getUserStateDomain();
    const userStateDomainState = userState.domains?.[userStateDomain];

    if (!userStateDomainState) {
      throw new Error(`User state response does not include required domain '${userStateDomain}'.`);
    }

    return {
      user_id: userState.user_id,
      username: userState.username,
      name: userState.name,
      status: this.toOpalUserStatus(userState.status),
      version: userState.version,
      business_unit_users: userStateDomainState.business_unit_users,
    };
  }

  private getUserStateResponseBody(response: HttpResponse<IOpalUserStateResponse>): IOpalUserStateResponse {
    if (!response.body) {
      throw new Error('User state response body is required.');
    }

    return response.body;
  }

  private isValidCachedUserState(userState: IOpalUserState): boolean {
    return typeof userState.user_id === 'number' && userState.user_id > 0;
  }

  private getCachedUserState(): IOpalUserState | null {
    const userState = this.globalStore.userState();

    if (this.isValidCachedUserState(userState) && Date.now() < this.userStateCacheExpiresAtMilliseconds) {
      return userState;
    }

    return null;
  }

  private getUserStateCacheTtlMilliseconds(response: HttpResponse<IOpalUserStateResponse>): number {
    const configuredTtlMilliseconds = this.globalStore.userStateCacheExpirationMilliseconds();
    const responseTtlHeader = response.headers.get(USER_STATE_CACHE_TTL_HEADER);

    if (responseTtlHeader === null) {
      return configuredTtlMilliseconds;
    }

    const responseTtlMilliseconds = Number(responseTtlHeader);

    if (Number.isFinite(responseTtlMilliseconds) && responseTtlMilliseconds >= 0) {
      return Math.min(responseTtlMilliseconds, configuredTtlMilliseconds);
    }

    return configuredTtlMilliseconds;
  }

  private clearLocalUserStateCache(): void {
    this.userStateCacheExpiresAtMilliseconds = 0;
    this.inFlightUserState$ = undefined;
  }

  /**
   * Retrieves the logged-in user's state as an observable.
   *
   * Uses the global store as a local cache until the configured user-state TTL expires.
   *
   * @returns {Observable<IOpalUserState>} An observable that emits the logged-in user's state.
   */
  public getLoggedInUserState(): Observable<IOpalUserState> {
    const cachedUserState = this.getCachedUserState();

    if (cachedUserState) {
      return of(cachedUserState);
    }

    if (this.inFlightUserState$) {
      return this.inFlightUserState$;
    }

    this.inFlightUserState$ = this.http
      .get<IOpalUserStateResponse>(OPAL_USER_PATHS.loggedInUserState, { observe: 'response' })
      .pipe(
        map((response) => ({
          userState: this.toOpalUserState(this.getUserStateResponseBody(response)),
          userStateCacheTtlMilliseconds: this.getUserStateCacheTtlMilliseconds(response),
        })),
        tap(({ userState, userStateCacheTtlMilliseconds }) => {
          this.globalStore.setUserState(userState);
          this.userStateCacheExpiresAtMilliseconds = Date.now() + userStateCacheTtlMilliseconds;
        }),
        map(({ userState }) => userState),
        catchError((error: unknown) => {
          this.userStateCacheExpiresAtMilliseconds = 0;
          return throwError(() => error);
        }),
        finalize(() => {
          this.inFlightUserState$ = undefined;
        }),
        shareReplay(1),
      );

    return this.inFlightUserState$;
  }

  /**
   * Resets the global store user to an empty object.
   *
   * Useful for logout/identity switches to avoid reusing stale state.
   */
  public clearUserStateCache(): void {
    this.globalStore.setUserState({} as IOpalUserState);
    this.clearLocalUserStateCache();
  }

  /**
   * Fetches the latest user state from the Redis-backed frontend endpoint.
   *
   * @returns An Observable that emits the current {@link IOpalUserState}.
   */
  public refreshUserState(): Observable<IOpalUserState> {
    this.clearLocalUserStateCache();
    return this.getLoggedInUserState();
  }
}
