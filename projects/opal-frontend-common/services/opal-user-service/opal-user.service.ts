import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { map, Observable, tap } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { OPAL_USER_STATE_RESPONSE_STATUS } from './constants/opal-user-state-response-status.constant';
import { IOpalUserStateResponse } from './interfaces/opal-user-state-response.interface';
import type { OpalUserStateResponseStatus } from './interfaces/opal-user-state-response-status.type';
import type { OpalUserStateStatus } from './interfaces/opal-user-state-status.type';

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

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

  /**
   * Retrieves the logged-in user's state as an observable.
   *
   * The frontend user-state endpoint is backed by Redis, so this service does not maintain its own cache.
   *
   * @returns {Observable<IOpalUserState>} An observable that emits the logged-in user's state.
   */
  public getLoggedInUserState(): Observable<IOpalUserState> {
    return this.http.get<IOpalUserStateResponse>(OPAL_USER_PATHS.loggedInUserState).pipe(
      map((userState) => this.toOpalUserState(userState)),
      tap((userState) => this.globalStore.setUserState(userState)),
    );
  }

  /**
   * Resets the global store user to an empty object.
   *
   * Useful for logout/identity switches to avoid reusing stale state.
   */
  public clearUserStateCache(): void {
    this.globalStore.setUserState({} as IOpalUserState);
  }

  /**
   * Fetches the latest user state from the Redis-backed frontend endpoint.
   *
   * @returns An Observable that emits the current {@link IOpalUserState}.
   */
  public refreshUserState(): Observable<IOpalUserState> {
    this.clearUserStateCache();
    return this.getLoggedInUserState();
  }
}
