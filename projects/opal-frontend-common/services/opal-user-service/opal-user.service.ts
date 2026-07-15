import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { catchError, filter, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
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
  private userStateRequestGeneration = 0;
  private userStateCacheExpiresAtMilliseconds = 0;

  /**
   * Converts the user-state API status into the service domain status.
   *
   * @param status - The status value returned by the user-state API.
   * @returns The mapped domain status, or null when the API status is null.
   */
  private toOpalUserStatus(status: OpalUserStateResponseStatus | null): OpalUserStateStatus | null {
    return status ? OPAL_USER_STATE_RESPONSE_STATUS[status] : null;
  }

  /**
   * Gets the configured user-state domain from the global store.
   *
   * @returns The trimmed user-state domain.
   * @throws When no non-blank user-state domain has been configured.
   */
  private getUserStateDomain(): string {
    const userStateDomain = this.globalStore.userStateDomain();
    if (typeof userStateDomain === 'string' && userStateDomain.trim()) {
      return userStateDomain.trim();
    }

    throw new Error('User state domain is required before loading user permissions.');
  }

  /**
   * Maps the Redis-backed user state response into the existing domain-specific user state shape.
   *
   * @param userState - The raw user-state API response.
   * @returns The mapped user state for the configured domain.
   * @throws When the response does not include the configured domain.
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

  /**
   * Extracts the body from the observed user-state HTTP response.
   *
   * @param response - The full HTTP response from the user-state endpoint.
   * @returns The response body.
   * @throws When the response body is empty.
   */
  private getUserStateResponseBody(response: HttpResponse<IOpalUserStateResponse>): IOpalUserStateResponse {
    if (!response.body) {
      throw new Error('User state response body is required.');
    }

    return response.body;
  }

  /**
   * Checks whether a user state can be used as a cached logged-in user.
   *
   * @param userState - The user state currently held in the global store.
   * @returns True when the user state contains a positive numeric user ID.
   */
  private isValidCachedUserState(userState: IOpalUserState): boolean {
    return typeof userState.user_id === 'number' && userState.user_id > 0;
  }

  /**
   * Gets the current cached user state when it is populated and unexpired.
   *
   * @returns The cached user state, or null when the cache is empty or expired.
   */
  private getCachedUserState(): IOpalUserState | null {
    const userState = this.globalStore.userState();

    if (this.isValidCachedUserState(userState) && Date.now() < this.userStateCacheExpiresAtMilliseconds) {
      return userState;
    }

    return null;
  }

  /**
   * Calculates the local cache TTL from the response header and configured maximum TTL.
   *
   * @param response - The full HTTP response from the user-state endpoint.
   * @returns The TTL in milliseconds. A zero response header expires the local cache immediately.
   */
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

  /**
   * Invalidates local cache controls and marks existing in-flight requests as stale.
   */
  private clearLocalUserStateCache(): void {
    this.userStateRequestGeneration += 1;
    this.userStateCacheExpiresAtMilliseconds = 0;
    this.inFlightUserState$ = undefined;
  }

  /**
   * Retrieves the logged-in user's state as an observable.
   *
   * Uses the global store as a local cache until the effective user-state TTL expires, shares concurrent HTTP
   * requests, and ignores stale responses after the local cache has been invalidated.
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

    const requestGeneration = this.userStateRequestGeneration;

    this.inFlightUserState$ = this.http
      .get<IOpalUserStateResponse>(OPAL_USER_PATHS.loggedInUserState, { observe: 'response' })
      .pipe(
        map((response) => ({
          userState: this.toOpalUserState(this.getUserStateResponseBody(response)),
          userStateCacheTtlMilliseconds: this.getUserStateCacheTtlMilliseconds(response),
          requestGeneration,
        })),
        filter(({ requestGeneration }) => requestGeneration === this.userStateRequestGeneration),
        tap(({ userState, userStateCacheTtlMilliseconds }) => {
          this.globalStore.setUserState(userState);
          this.userStateCacheExpiresAtMilliseconds = Date.now() + userStateCacheTtlMilliseconds;
        }),
        map(({ userState }) => userState),
        catchError((error: unknown) => {
          if (requestGeneration === this.userStateRequestGeneration) {
            this.userStateCacheExpiresAtMilliseconds = 0;
          }

          return throwError(() => error);
        }),
        finalize(() => {
          if (requestGeneration === this.userStateRequestGeneration) {
            this.inFlightUserState$ = undefined;
          }
        }),
        shareReplay(1),
      );

    return this.inFlightUserState$;
  }

  /**
   * Clears the global store user state and invalidates local user-state cache controls.
   *
   * Useful for logout and identity switches to avoid reusing stale state or accepting stale in-flight responses.
   */
  public clearUserStateCache(): void {
    this.globalStore.setUserState({} as IOpalUserState);
    this.clearLocalUserStateCache();
  }

  /**
   * Fetches the latest user state from the Redis-backed frontend endpoint, bypassing the current local cache.
   *
   * @returns An Observable that emits the current {@link IOpalUserState}.
   */
  public refreshUserState(): Observable<IOpalUserState> {
    this.clearLocalUserStateCache();
    return this.getLoggedInUserState();
  }
}
