import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterEvent } from '@angular/router';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { NavigationAuthenticationService } from './navigation-authentication.service';

describe('NavigationAuthenticationService', () => {
  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let authenticationSubscriptions: number;
  let authenticationUnsubscriptions: number;
  let currentNavigationId: number;
  let routerEvents: Subject<RouterEvent>;
  let service: NavigationAuthenticationService;

  const configureService = (platformId: 'browser' | 'server' = 'browser') => {
    currentNavigationId = 1;
    authenticationSubscriptions = 0;
    authenticationUnsubscriptions = 0;
    checkAuthenticatedMock = vi.fn().mockImplementation(
      () =>
        new Observable((subscriber) => {
          authenticationSubscriptions += 1;
          subscriber.next(true);

          return () => {
            authenticationUnsubscriptions += 1;
          };
        }),
    );
    routerEvents = new Subject<RouterEvent>();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { checkAuthenticated: checkAuthenticatedMock },
        },
        {
          provide: Router,
          useValue: {
            currentNavigation: () => ({ id: currentNavigationId }),
            events: routerEvents,
          },
        },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });

    service = TestBed.inject(NavigationAuthenticationService);
  };

  beforeEach(() => {
    configureService();
  });

  it('retains authentication after a guard unsubscribes within one navigation', async () => {
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(authenticationSubscriptions).toBe(1);
  });

  it('rechecks authentication for a later navigation', async () => {
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    currentNavigationId = 2;

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
    expect(authenticationSubscriptions).toBe(2);
    expect(authenticationUnsubscriptions).toBe(1);
  });

  it.each([
    ['completes', () => new NavigationEnd(1, '/fines', '/fines')],
    ['is cancelled', () => new NavigationCancel(1, '/fines', 'Navigation cancelled')],
    ['errors', () => new NavigationError(1, '/fines', new Error('Navigation failed'))],
  ])('discards the shared authentication check when navigation %s', async (_description, createNavigationEvent) => {
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    routerEvents.next(createNavigationEvent());

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
    expect(authenticationSubscriptions).toBe(2);
    expect(authenticationUnsubscriptions).toBe(1);
  });

  it('cancels a pending authentication check when navigation is cancelled', () => {
    service.checkAuthenticated().subscribe();

    routerEvents.next(new NavigationCancel(1, '/fines', 'Navigation cancelled'));

    expect(authenticationUnsubscriptions).toBe(1);
  });

  it('shares authentication checks within one server-rendered navigation', async () => {
    TestBed.resetTestingModule();
    configureService('server');

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(authenticationSubscriptions).toBe(1);
  });

  it('does not share authentication between server-rendered application requests', async () => {
    TestBed.resetTestingModule();
    configureService('server');

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    const firstRequestCheckAuthenticatedMock = checkAuthenticatedMock;
    const firstRequestAuthenticationSubscriptions = authenticationSubscriptions;

    TestBed.resetTestingModule();
    configureService('server');

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(firstRequestCheckAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(firstRequestAuthenticationSubscriptions).toBe(1);
    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
    expect(authenticationSubscriptions).toBe(1);
  });
});
