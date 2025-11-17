import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { tap, Observable, of } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';
import { IOpalUserStateCached } from './interfaces/opal-user-state-cached.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);
  private readonly dateService = inject(DateService);
  private userStateCache!: IOpalUserStateCached;

  /**
   * Checks if the cached user state has expired.
   *
   * @returns True if the cache has expired, false otherwise.
   */
  private isCacheExpired(): boolean {
    if (!this.userStateCache?.expiryAt) {
      return true;
    }

    const now = this.dateService.getDateNow();
    const expiryTime = this.dateService.getFromIso(this.userStateCache.expiryAt);
    return now > expiryTime;
  }

  /**
   * Clears the cached user state.
   */
  private clearCache(): void {
    this.userStateCache = {} as IOpalUserStateCached;
  }

  /**
   * Retrieves the logged-in user's state as an observable.
   *
   * This method first checks if the user state is cached and the cache is still valid.
   * If so, it returns the cached user state. Otherwise, it fetches the user state
   * from the server, updates the cache, and sets the user state in the global store.
   *
   * @returns {Observable<IOpalUserState>} An observable that emits the logged-in user's state.
   */
  public getLoggedInUserState(): Observable<IOpalUserState> {
    // Reset user state in global store at the start
    this.globalStore.setUserState({} as IOpalUserState);

    if (this.userStateCache?.userState && !this.isCacheExpired()) {
      this.globalStore.setUserState(this.userStateCache.userState);
      return of(this.userStateCache.userState);
    }

    // Calculate new expiry time
    const expiresAt = this.dateService
      .getDateNow()
      .plus({ milliseconds: this.globalStore.userStateCacheExpirationMilliseconds() });

    // Fetch fresh data
    return this.http.get<IOpalUserState>(OPAL_USER_PATHS.loggedInUserState).pipe(
      tap((userState) => {
        this.userStateCache = {
          userState: userState,
          expiryAt: expiresAt.toISO(),
        };
        this.globalStore.setUserState(userState);
      }),
    );
  }

  /**
   * Forces a fresh fetch of user state, bypassing the cache.
   *
   * @returns An Observable that emits the current {@link IOpalUserState}.
   */
  public refreshUserState(): Observable<IOpalUserState> {
    this.clearCache();
    return this.getLoggedInUserState();
  }
}
