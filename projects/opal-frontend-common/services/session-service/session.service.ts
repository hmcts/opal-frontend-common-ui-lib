import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { retry, shareReplay, tap } from 'rxjs/operators';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_ENDPOINTS } from '@hmcts/opal-frontend-common/services/session-service/constants';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly globalStore = inject(GlobalStore);
  private tokenExpiryCache$!: Observable<ISessionTokenExpiry>;

  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 1000;

  /**
   * Always fetch access-token expiry from the server (no in-memory caching).
   * Adds cache-busting query param and no-cache headers.
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
