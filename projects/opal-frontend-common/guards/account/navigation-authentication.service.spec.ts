import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterEvent } from '@angular/router';
import { firstValueFrom, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { NavigationAuthenticationService } from './navigation-authentication.service';

describe('NavigationAuthenticationService', () => {
  let checkAuthenticatedMock: ReturnType<typeof vi.fn>;
  let currentNavigationId: number;
  let routerEvents: Subject<RouterEvent>;
  let service: NavigationAuthenticationService;

  const configureService = (platformId: 'browser' | 'server') => {
    currentNavigationId = 1;
    checkAuthenticatedMock = vi.fn().mockReturnValue(of(true));
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
    configureService('browser');
  });

  it('shares authentication checks within one client-side navigation', async () => {
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(1);
  });

  it('rechecks authentication for a later client-side navigation', async () => {
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    currentNavigationId = 2;

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
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
  });

  it('does not share authentication checks during server-side rendering', async () => {
    TestBed.resetTestingModule();
    configureService('server');

    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);
    await expect(firstValueFrom(service.checkAuthenticated())).resolves.toBe(true);

    expect(checkAuthenticatedMock).toHaveBeenCalledTimes(2);
  });
});
