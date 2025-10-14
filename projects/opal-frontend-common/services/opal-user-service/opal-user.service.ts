import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalUserState } from './interfaces/opal-user-state.interface';
import { tap, Observable, catchError, throwError } from 'rxjs';
import { OPAL_USER_PATHS } from './constants/opal-user-paths.constant';

@Injectable({ providedIn: 'root' })
export class OpalUserService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Updates the user state in the global store.
   *
   * @param userState - The new user state to be set, adhering to the `IOpalUserState` interface.
   */
  private setUserState(userState: IOpalUserState): void {
    this.globalStore.setUserState(userState);
  }

  /**
   * Retrieves the logged-in user's state from the server and updates the global store.
   *
   * @returns An `Observable` of the logged-in user's state (`IOpalUserState`).
   *
   * @remarks
   * - If the server responds with a 404 status, a new user is added by calling `addUser()`.
   * - If the server responds with a 409 status, the user is updated by calling `updateUser()`.
   * - For other errors, the error is rethrown.
   *
   * @throws `HttpErrorResponse` if an error occurs that is not handled explicitly.
   */
  public getLoggedInUserState(): Observable<IOpalUserState> {
    this.globalStore.setUserState({} as IOpalUserState);
    return this.http.get<IOpalUserState>(OPAL_USER_PATHS.loggedInUserState).pipe(
      tap((userState) => this.setUserState(userState)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.addUser();
        }
        if (error.status === 409) {
          return this.updateUser();
        }
        return throwError(() => error);
      }),
    );
  }

  /**
   * Adds a new user by making an HTTP POST request to the specified endpoint.
   * The resulting user state is stored in the global store upon success.
   *
   * @returns {Observable<IOpalUserState>} An observable that emits the updated user state.
   */
  public addUser(): Observable<IOpalUserState> {
    return this.http
      .post<IOpalUserState>(OPAL_USER_PATHS.addUser, {})
      .pipe(tap((userState) => this.setUserState(userState)));
  }

  /**
   * Updates the user state by making an HTTP PUT request to the specified endpoint.
   * The updated user state is then stored in the global store.
   *
   * @returns {Observable<IOpalUserState>} An observable that emits the updated user state.
   */
  public updateUser(): Observable<IOpalUserState> {
    return this.http
      .put<IOpalUserState>(OPAL_USER_PATHS.updateUser, {})
      .pipe(tap((userState) => this.setUserState(userState)));
  }
}
