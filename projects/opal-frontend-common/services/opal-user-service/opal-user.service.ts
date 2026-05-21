import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { map, Observable, tap } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { IOpalUserBusinessUnitUser } from './interfaces/opal-user-business-unit-user.interface';

type IOpalUserStateResponseStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED';

interface IOpalUserStateResponseDomain {
  business_unit_users: IOpalUserBusinessUnitUser[];
}

interface IOpalUserStateResponse {
  user_id: number;
  username: string;
  name: string;
  status: IOpalUserStateResponseStatus | null;
  version: number | null;
  cache_name: string | null;
  domains: Record<string, IOpalUserStateResponseDomain | undefined>;
}

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

  private toOpalUserStatus(status: IOpalUserStateResponseStatus | null): string | null {
    switch (status) {
      case 'ACTIVE':
        return 'active';
      case 'PENDING':
        return 'created';
      case 'SUSPENDED':
        return 'suspended';
      case 'DEACTIVATED':
        return 'deactivated';
      default:
        return null;
    }
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
