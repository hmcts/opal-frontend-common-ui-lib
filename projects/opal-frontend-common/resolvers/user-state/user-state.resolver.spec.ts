import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { userStateResolver } from './user-state.resolver';
import { of } from 'rxjs';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';

describe('userStateResolver', () => {
  const executeResolver: ResolveFn<ISessionUserState> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userStateResolver(...resolverParameters));
  let mockSessionService: jasmine.SpyObj<SessionService>;
  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj(SessionService, ['getUserState']);

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve user state', async () => {
    const mockUserState: ISessionUserState = SESSION_USER_STATE_MOCK;
    mockSessionService.getUserState.and.returnValue(of(mockUserState));

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
