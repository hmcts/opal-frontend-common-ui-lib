import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { userStateResolver } from './user-state.resolver';
import { of } from 'rxjs';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';

describe('userStateResolver', () => {
  const executeResolver: ResolveFn<IOpalUserState> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userStateResolver(...resolverParameters));
  let mockOpalUserService: jasmine.SpyObj<OpalUserService>;
  beforeEach(() => {
    mockOpalUserService = jasmine.createSpyObj(OpalUserService, ['getLoggedInUserState']);

    TestBed.configureTestingModule({
      providers: [{ provide: OpalUserService, useValue: mockOpalUserService }],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve user state', async () => {
    const mockUserState: IOpalUserState = OPAL_USER_STATE_MOCK;
    mockOpalUserService.getLoggedInUserState.and.returnValue(of(mockUserState));

    const urlPath = 'account-enquiry-search';
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = {
      url: urlPath,
      root: new ActivatedRouteSnapshot(),
    };

    const result = await executeResolver(dummyRoute, dummyState);
    expect(result).toEqual(mockUserState);
  });
});
