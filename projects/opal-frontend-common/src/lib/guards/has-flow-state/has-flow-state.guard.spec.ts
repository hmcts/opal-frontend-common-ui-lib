import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  ParamMap,
  convertToParamMap,
} from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { hasFlowStateGuard } from './has-flow-state.guard';

describe('hasFlowStateGuard', () => {
  let router: Router;
  let mockUrlTree: UrlTree;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine.createSpy('createUrlTree'),
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    mockUrlTree = TestBed.inject(Router).createUrlTree(['/redirect']);
    (router.createUrlTree as jasmine.Spy).and.returnValue(mockUrlTree);
  });

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

  it('should return true when checkCondition returns true', () => {
    const getState = jasmine.createSpy('getState').and.returnValue({ key: 'value' });
    const checkCondition = jasmine.createSpy('checkCondition').and.returnValue(true);
    const getNavigationPath = jasmine.createSpy('getNavigationPath').and.returnValue('/redirect');

    const guard = hasFlowStateGuard(getState, checkCondition, getNavigationPath);

    const result = TestBed.runInInjectionContext(() =>
      guard(mockActivatedRouteSnapshot({ test: '1' }, 'section'), {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
    expect(getState).toHaveBeenCalled();
    expect(checkCondition).toHaveBeenCalledWith({ key: 'value' });
    expect(getNavigationPath).not.toHaveBeenCalled();
  });

  it('should return a UrlTree when checkCondition returns false', () => {
    const getState = jasmine.createSpy('getState').and.returnValue({ key: 'value' });
    const checkCondition = jasmine.createSpy('checkCondition').and.returnValue(false);
    const getNavigationPath = jasmine.createSpy('getNavigationPath').and.returnValue('/redirect');

    const guard = hasFlowStateGuard(getState, checkCondition, getNavigationPath);

    const result = TestBed.runInInjectionContext(() =>
      guard(mockActivatedRouteSnapshot({ test: '1' }, 'section'), {} as RouterStateSnapshot),
    );

    expect(result).toBe(mockUrlTree);
    expect(getState).toHaveBeenCalled();
    expect(checkCondition).toHaveBeenCalledWith({ key: 'value' });
    expect(getNavigationPath).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
      queryParams: { test: '1' },
      fragment: 'section',
    });
  });

  it('should return a UrlTree when checkCondition returns false with undefined queryParams and fragment', () => {
    const getState = jasmine.createSpy('getState').and.returnValue({ key: 'value' });
    const checkCondition = jasmine.createSpy('checkCondition').and.returnValue(false);
    const getNavigationPath = jasmine.createSpy('getNavigationPath').and.returnValue('/redirect');

    const guard = hasFlowStateGuard(getState, checkCondition, getNavigationPath);

    const result = TestBed.runInInjectionContext(() => guard(mockActivatedRouteSnapshot(), {} as RouterStateSnapshot));

    expect(result).toBe(mockUrlTree);
    expect(getState).toHaveBeenCalled();
    expect(checkCondition).toHaveBeenCalledWith({ key: 'value' });
    expect(getNavigationPath).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/redirect'], {
      queryParams: undefined,
      fragment: undefined,
    });
  });
});
