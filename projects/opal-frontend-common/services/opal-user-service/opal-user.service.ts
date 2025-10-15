import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { tap, Observable } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Retrieves the current logged-in user's state from the backend and updates the global store.
   *
   * This method first resets the user state in the global store to an empty object,
   * then performs an HTTP GET request to fetch the latest user state.
   * Upon receiving the response, it updates the global store with the fetched user state.
   *
   * @returns An Observable that emits the current {@link IOpalUserState}.
   */
  public getLoggedInUserState(): Observable<IOpalUserState> {
    this.globalStore.setUserState({} as IOpalUserState);
    return this.http
      .get<IOpalUserState>(OPAL_USER_PATHS.loggedInUserState)
      .pipe(tap((userState) => this.globalStore.setUserState(userState)));
  }
}
