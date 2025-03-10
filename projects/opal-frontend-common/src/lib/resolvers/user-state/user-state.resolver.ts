import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ISessionUserState, SessionService } from '../../services';

/**
 * Resolver function for retrieving the user state.
 * @returns A promise that resolves to the user state.
 */
export const userStateResolver: ResolveFn<ISessionUserState> = async () => {
  // Weirdly angular suggests using async/await - https://angular.dev/api/router/ResolveFn?tab=usage-notes
  return await firstValueFrom(inject(SessionService).getUserState());
};
