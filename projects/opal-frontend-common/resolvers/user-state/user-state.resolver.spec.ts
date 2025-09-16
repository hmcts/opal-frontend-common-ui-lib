import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { userStateResolver } from './user-state.resolver';
import { of } from 'rxjs';
import { IUserState } from '@hmcts/opal-frontend-common/services/user-service/interfaces';
import { UserService } from '@hmcts/opal-frontend-common/services/user-service';
import { USER_STATE_MOCK } from 'projects/opal-frontend-common/services/user-service/mocks/user-state.mock';

describe('userStateResolver', () => {
  const executeResolver: ResolveFn<IUserState> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userStateResolver(...resolverParameters));
  let mockUserService: jasmine.SpyObj<UserService>;
  beforeEach(() => {
    mockUserService = jasmine.createSpyObj(UserService, ['getUserState']);

    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: mockUserService }],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve user state', async () => {
    const mockUserState: IUserState = USER_STATE_MOCK;
    mockUserService.getUserState.and.returnValue(of(mockUserState));

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
