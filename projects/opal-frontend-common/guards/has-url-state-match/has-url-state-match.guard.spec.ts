import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
  RouterStateSnapshot,
  ParamMap,
  convertToParamMap,
} from '@angular/router';
import { hasUrlStateMatchGuard } from './has-url-state-match.guard';

interface MockState {
  selectedAccount?: {
    accountNumber: string;
  };
}

function mockActivatedRouteSnapshot(
  queryParams?: Record<string, string> | undefined,
  fragment?: string | null,
): ActivatedRouteSnapshot {
  return {
    queryParams: queryParams,
    fragment: fragment,
    url: [],
    params: {},
    data: {},
    title: undefined,
    outlet: 'primary',
    component: null,
    routeConfig: null,
    root: {} as ActivatedRouteSnapshot,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: queryParams ? convertToParamMap(queryParams) : ({} as ParamMap),
    queryParamMap: queryParams ? convertToParamMap(queryParams) : ({} as ParamMap),
  } as ActivatedRouteSnapshot;
}

describe('hasUrlStateMatchGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: MockState;
  let mockRouterState: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = mockActivatedRouteSnapshot();

    mockState = {};
    mockRouterState = {} as RouterStateSnapshot;
  });


  it('should return UrlTree and redirect when hasRouteParams returns false', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => false;
      const checkCondition = () => true;
      const getNavigationPath = () => '/redirect';
      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);
      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should return UrlTree regardless of state or condition when hasRouteParams returns false', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      mockState.selectedAccount = { accountNumber: '12345' };

      const getState = () => mockState;
      const hasRouteParams = () => false;
      const checkCondition = (state: MockState) => state.selectedAccount?.accountNumber === '99999';
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should return true when checkCondition returns true', () => {
    TestBed.runInInjectionContext(() => {
      mockState.selectedAccount = { accountNumber: '12345' };

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = (state: MockState) => state.selectedAccount?.accountNumber === '12345';
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
    });
  });

  it('should return true when checkCondition returns true with complex state', () => {
    TestBed.runInInjectionContext(() => {
      const complexState = {
        selectedAccount: { accountNumber: 'ACCOUNT123' },
        user: { id: 'user1' },
      };

      const getState = () => complexState;
      const hasRouteParams = () => true;
      const checkCondition = (state: typeof complexState) =>
        state.selectedAccount?.accountNumber === 'ACCOUNT123' && state.user?.id === 'user1';
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<typeof complexState>(
        getState,
        hasRouteParams,
        checkCondition,
        getNavigationPath,
      );

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
    });
  });

  it('should return UrlTree when checkCondition returns false', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      mockState.selectedAccount = { accountNumber: '12345' };

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = (state: MockState) => state.selectedAccount?.accountNumber === '99999';
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should return UrlTree when state is undefined', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = (state: MockState) => !!state.selectedAccount;
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should throw error when checkCondition throws an error', () => {
    TestBed.runInInjectionContext(() => {
      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = () => {
        throw new Error('Condition check failed');
      };
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      expect(() => guard(mockRoute, mockRouterState)).toThrowError('Condition check failed');
    });
  });

  it('should redirect to specified route path', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = () => false;
      const getNavigationPath = () => '/custom/redirect/path';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/custom/redirect/path'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should redirect to root when getNavigationPath returns empty string', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = () => false;
      const getNavigationPath = () => '';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith([''], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should preserve query parameters and fragment in redirect', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      mockRoute.queryParams = { param1: 'value1', param2: 'value2' };
      mockRoute.fragment = 'section1';

      const getState = () => mockState;
      const isCanonicalUrl = () => true;
      const checkCondition = () => false;
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, isCanonicalUrl, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: { param1: 'value1', param2: 'value2' },
        fragment: 'section1',
      });
    });
  });

  it('should handle null state gracefully', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getState = () => null as any;
      const hasRouteParams = () => true;
      const checkCondition = (state: MockState | null) => !!state?.selectedAccount;
      const getNavigationPath = () => '/redirect';
      const guard = hasUrlStateMatchGuard<MockState | null>(
        getState,
        hasRouteParams,
        checkCondition,
        getNavigationPath,
      );

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should handle falsy checkCondition results', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkCondition = () => 0 as any; // falsy value
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
        queryParams: undefined,
        fragment: undefined,
      });
    });
  });

  it('should handle truthy checkCondition results', () => {
    TestBed.runInInjectionContext(() => {
      const getState = () => mockState;
      const hasRouteParams = () => true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkCondition = () => 'truthy' as any; // truthy value
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      const result = guard(mockRoute, mockRouterState);

      expect(result).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
    });
  });

  it('should pass route parameter to hasRouteParams function', () => {
    TestBed.runInInjectionContext(() => {
      const getState = () => mockState;
      const hasRouteParams = jasmine.createSpy('hasRouteParams').and.returnValue(false);
      const checkCondition = () => true;
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      guard(mockRoute, mockRouterState);

      expect(hasRouteParams).toHaveBeenCalledWith(mockRoute);
    });
  });

  it('should pass state and route to checkCondition function', () => {
    TestBed.runInInjectionContext(() => {
      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = jasmine.createSpy('checkCondition').and.returnValue(true);
      const getNavigationPath = () => '/redirect';

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      guard(mockRoute, mockRouterState);

      expect(checkCondition).toHaveBeenCalledWith(mockState, mockRoute);
    });
  });

  it('should pass route to getNavigationPath function when redirecting', () => {
    TestBed.runInInjectionContext(() => {
      const mockUrlTree = {} as UrlTree;
      router.createUrlTree.and.returnValue(mockUrlTree);

      const getState = () => mockState;
      const hasRouteParams = () => true;
      const checkCondition = () => false;
      const getNavigationPath = jasmine.createSpy('getNavigationPath').and.returnValue('/redirect');

      const guard = hasUrlStateMatchGuard<MockState>(getState, hasRouteParams, checkCondition, getNavigationPath);

      guard(mockRoute, mockRouterState);

      expect(getNavigationPath).toHaveBeenCalledWith(mockRoute);
    });
  });
});
