import { type GuardResult, type MaybeAsync } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';

/**
 * Converts any valid Angular guard result into a promise so callers can await the final value consistently.
 */
export const resolveGuardResult = (result: MaybeAsync<GuardResult>): Promise<GuardResult> =>
  isObservable(result) ? firstValueFrom(result) : Promise.resolve(result);
