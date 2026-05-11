import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { USER_STATE_ENDPOINTS } from './constants/user-state-endpoints.constant';
import { IUserState } from './interfaces/user-state.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);

  private toOpalUserState(userState: IUserState): IOpalUserState {
    return {
      user_id: userState.user_id,
      username: userState.username,
      name: userState.name,
      status: userState.status,
      version: userState.version,
      business_unit_users: userState.domains.fines?.business_unit_users ?? [],
    };
  }

  public getUserState(): Observable<IUserState> {
    return this.http
      .get<IUserState>(USER_STATE_ENDPOINTS.userState)
      .pipe(tap((userState) => this.globalStore.setUserState(this.toOpalUserState(userState))));
  }
}
