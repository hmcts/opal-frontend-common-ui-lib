import { type ActivatedRouteSnapshot, type MaybeAsync } from '@angular/router';

export interface BusinessUnitIdResolver {
  resolveBusinessUnitId(route: ActivatedRouteSnapshot): MaybeAsync<number | null>;
}
