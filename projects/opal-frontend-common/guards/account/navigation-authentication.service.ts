import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter, Observable, shareReplay } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';

/**
 * Shares authentication checks between guards evaluated during one client-side navigation.
 *
 * Server-side rendering bypasses the cache so authentication results cannot be shared between
 * separate server requests.
 */
@Injectable({ providedIn: 'root' })
export class NavigationAuthenticationService {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private authenticatedForNavigation$?: Observable<boolean>;
  private navigationId?: number;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationCancel | NavigationEnd | NavigationError =>
              event instanceof NavigationCancel || event instanceof NavigationEnd || event instanceof NavigationError,
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((event) => {
          if (event.id === this.navigationId) {
            this.authenticatedForNavigation$ = undefined;
            this.navigationId = undefined;
          }
        });
    }
  }

  /**
   * Gets the authenticated state for the current navigation.
   *
   * @returns The shared authentication result for the current client-side navigation, or a fresh result on the server.
   */
  public checkAuthenticated(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return this.authService.checkAuthenticated();
    }

    const currentNavigation = this.router.currentNavigation();

    if (!currentNavigation) {
      return this.authService.checkAuthenticated();
    }

    if (this.navigationId === currentNavigation.id && this.authenticatedForNavigation$) {
      return this.authenticatedForNavigation$;
    }

    const authenticated$ = this.authService.checkAuthenticated().pipe(shareReplay({ bufferSize: 1, refCount: true }));

    this.navigationId = currentNavigation.id;
    this.authenticatedForNavigation$ = authenticated$;

    return authenticated$;
  }
}
