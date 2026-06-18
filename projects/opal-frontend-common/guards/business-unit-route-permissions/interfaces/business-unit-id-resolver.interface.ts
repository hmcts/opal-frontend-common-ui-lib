import { type ActivatedRouteSnapshot, type MaybeAsync } from '@angular/router';

/**
 * Contract implemented by consuming apps to resolve the business unit for the active route.
 */
export interface BusinessUnitIdResolver {
  /**
   * Resolves the business unit id that should be used for route-level permission checks.
   *
   * Return `null` when the business unit cannot be determined for the route.
   *
   * @param route - The route being protected by the business-unit permission guard.
   * @returns The business unit id, or `null` when no valid business unit is available.
   */
  resolveBusinessUnitId(route: ActivatedRouteSnapshot): MaybeAsync<number | null>;
}
