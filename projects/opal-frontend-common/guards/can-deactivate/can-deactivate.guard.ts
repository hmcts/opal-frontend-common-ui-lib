import { CanDeactivateFn } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from './interfaces/can-deactivate-can-component-deactivate.interface';

export const canDeactivateGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (
  component: ICanDeactivateCanComponentDeactivate,
) => {
  return component.canDeactivate()
    ? true
    : confirm('WARNING: Are you sure you want to cancel? Any information you entered will be lost.');
};
