import {
  ActivatedRouteSnapshot,
  UrlSegment,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GuardReturnType } from '../types';

/**
 * Returns a function that invokes the specified guard with a dummy route and state.
 * The dummy route and state are created using the provided `urlPath`.
 *
 * @param guard - The guard function to be invoked.
 * @param urlPath - The URL path to be used in the dummy route and state.
 * @returns A function that invokes the guard with the dummy route and state.
 */
export function getGuardWithDummyUrl(
  guard: CanActivateFn,
  urlPath: string
): () =>
  | GuardReturnType
  | Promise<GuardReturnType>
  | Observable<GuardReturnType> {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];
  const dummyState: RouterStateSnapshot = {
    url: urlPath,
    root: new ActivatedRouteSnapshot(),
  };
  return () => guard(dummyRoute, dummyState);
}
