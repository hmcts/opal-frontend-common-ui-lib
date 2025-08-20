import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree, RouterStateSnapshot } from '@angular/router';
import { hasUrlStateMatchGuard } from './has-url-state-match.guard';

interface MockState {
  selectedAccount?: {
    accountNumber: string;
  };
}

describe('hasUrlStateMatchGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: MockState;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {
      params: {},
      queryParams: {},
      fragment: null,
    } as ActivatedRouteSnapshot;

    mockState = {};
  });

  it('should return true when no account number in URL', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'], // Skip if no account number
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = {};

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
  });

  it('should return true when URL parameter is undefined', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'],
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: undefined };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
  });

  it('should return true when account numbers match', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'],
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockState = {
      selectedAccount: {
        accountNumber: '12345',
      },
    };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect when no account in state', () => {
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'],
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockRoute.queryParams = {};
    mockRoute.fragment = null;
    mockState = {}; // No selectedAccount

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/account/12345/search'], {
      queryParams: undefined,
      fragment: undefined,
    });
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect when account numbers do not match', () => {
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'],
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockRoute.queryParams = {};
    mockState = {
      selectedAccount: {
        accountNumber: '67890',
      },
    };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/account/12345/search'], {
      queryParams: undefined,
      fragment: undefined,
    });
    expect(result).toBe(mockUrlTree);
  });

  it('should preserve query params and fragment when redirecting', () => {
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountNumber'],
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockRoute.queryParams = { tab: 'details' };
    mockRoute.fragment = 'section1';
    mockState = {};

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/account/12345/search'], {
      queryParams: { tab: 'details' },
      fragment: 'section1',
    });
    expect(result).toBe(mockUrlTree);
  });

  it('should work with query parameter validation', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.queryParams['userId'],
      (state, route) => state.selectedAccount?.accountNumber === route.queryParams['userId'],
      () => '/login',
    );

    mockRoute.queryParams = { userId: '12345' };
    mockState = {
      selectedAccount: {
        accountNumber: '12345',
      },
    };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
  });

  it('should work with complex validation logic', () => {
    interface ComplexState {
      user?: {
        accounts?: Array<{ id: string; name: string }>;
        currentAccountId?: string;
      };
    }

    const complexState: ComplexState = {
      user: {
        accounts: [
          { id: 'ACC123', name: 'Account 1' },
          { id: 'ACC456', name: 'Account 2' },
        ],
        currentAccountId: 'ACC123',
      },
    };

    const guard = hasUrlStateMatchGuard(
      () => complexState,
      (route) => !route.params['accountId'],
      (state, route) => {
        const urlAccountId = route.params['accountId'];
        const hasAccount = state.user?.accounts?.some((account) => account.id === urlAccountId) ?? false;
        const isCurrentAccount = state.user?.currentAccountId === urlAccountId;
        return hasAccount && isCurrentAccount;
      },
      (route) => `/accounts/${route.params['accountId']}/details`,
    );

    mockRoute.params = { accountId: 'ACC123' };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
  });

  it('should work with multiple parameter validation', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => !route.params['accountId'] || !route.params['caseId'],
      (state, route) => {
        const expectedKey = `${route.params['accountId']}-${route.params['caseId']}`;
        const stateKey = state.selectedAccount ? `${state.selectedAccount.accountNumber}-case123` : '';
        return expectedKey === stateKey;
      },
      (route) => `/account/${route.params['accountId']}/cases`,
    );

    mockRoute.params = { accountId: '12345', caseId: 'case123' };
    mockState = {
      selectedAccount: {
        accountNumber: '12345',
      },
    };

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
  });
  it('should handle null state gracefully', () => {
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const guard = hasUrlStateMatchGuard(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => null as any,
      (route) => !route.params['accountNumber'],
      (state, route) => state?.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockRoute.queryParams = {};

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/account/12345/search'], {
      queryParams: undefined,
      fragment: undefined,
    });
    expect(result).toBe(mockUrlTree);
  });

  it('should handle undefined state gracefully', () => {
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const guard = hasUrlStateMatchGuard(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => undefined as any,
      (route) => !route.params['accountNumber'],
      (state, route) => state?.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: '12345' };
    mockRoute.queryParams = {};

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/account/12345/search'], {
      queryParams: undefined,
      fragment: undefined,
    });
    expect(result).toBe(mockUrlTree);
  });

  it('should handle custom checkRoute logic', () => {
    const guard = hasUrlStateMatchGuard(
      () => mockState,
      (route) => {
        // Custom logic: skip validation for admin routes
        return route.params['accountNumber']?.startsWith('ADMIN');
      },
      (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
      (route) => `/account/${route.params['accountNumber']}/search`,
    );

    mockRoute.params = { accountNumber: 'ADMIN123' };
    mockState = {}; // Empty state, but should still pass due to checkRoute

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, {} as RouterStateSnapshot));

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
