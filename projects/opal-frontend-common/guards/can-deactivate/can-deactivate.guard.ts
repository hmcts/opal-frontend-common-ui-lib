import { CanDeactivateFn } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from './interfaces/can-deactivate-can-component-deactivate.interface';
import { CAN_DEACTIVATE_WARNING_MESSAGE } from './constants/can-deactivate-warning-message.constant';

export const canDeactivateGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (
  component: ICanDeactivateCanComponentDeactivate,
) => {
  return component.canDeactivate() ? true : confirm(CAN_DEACTIVATE_WARNING_MESSAGE);
};
