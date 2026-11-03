import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';

interface NavigationAuthentication {
  authentication$: Observable<boolean>;
  cancellation$: Subject<void>;
  id: number;
}

/**
 * Shares authentication checks between guards evaluated during one navigation.
 *
 * A server-rendered application has its own root injector for each request, so this service's
 * navigation cache is isolated between SSR requests while still sharing checks within one request.
 */
@Injectable({ providedIn: 'root' })
export class NavigationAuthenticationService {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private navigationAuthentication?: NavigationAuthentication;

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationCancel | NavigationEnd | NavigationError =>
            event instanceof NavigationCancel || event instanceof NavigationEnd || event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.clearNavigationAuthentication(event.id));
  }

  /**
   * Cancels an in-flight authentication check and discards its cached result after a navigation ends.
   *
   * @param navigationId - The router navigation that reached a terminal state.
   */
  private clearNavigationAuthentication(navigationId: number): void {
    if (this.navigationAuthentication?.id !== navigationId) {
      return;
    }

    this.navigationAuthentication.cancellation$.next();
    this.navigationAuthentication.cancellation$.complete();
    this.navigationAuthentication = undefined;
  }

  /**
   * Gets the authenticated state for the current navigation.
   *
   * @returns The shared authentication result for the current navigation, or a fresh result when no navigation is active.
   */
  public checkAuthenticated(): Observable<boolean> {
    const currentNavigation = this.router.currentNavigation();

    if (!currentNavigation) {
      return this.authService.checkAuthenticated();
    }

    if (this.navigationAuthentication?.id === currentNavigation.id) {
      return this.navigationAuthentication.authentication$;
    }

    if (this.navigationAuthentication) {
      this.clearNavigationAuthentication(this.navigationAuthentication.id);
    }

    const cancellation$ = new Subject<void>();
    const authentication$ = this.authService
      .checkAuthenticated()
      .pipe(
        takeUntil(cancellation$),
        takeUntilDestroyed(this.destroyRef),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.navigationAuthentication = {
      authentication$,
      cancellation$,
      id: currentNavigation.id,
    };

    return authentication$;
  }
}
