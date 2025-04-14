import { TestBed, fakeAsync } from '@angular/core/testing';
import { CanActivateFn, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { of, throwError } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let globalStore: GlobalStoreType;

  const urlPath = '/test-page';
  const expectedUrl = 'sign-in';

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(authGuard, ['checkAuthenticated']);
    mockRouter = jasmine.createSpyObj(authGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the user is logged in ', fakeAsync(async () => {
    mockAuthService.checkAuthenticated.and.returnValue(of(true));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));
    expect(authenticated).toBeTruthy();
  }));

  it('should redirect to login with originalUrl and loggedOut url if catches an error ', fakeAsync(async () => {
    globalStore.setSsoEnabled(false);
    mockAuthService.checkAuthenticated.and.returnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(authGuard, urlPath));
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  }));
});
