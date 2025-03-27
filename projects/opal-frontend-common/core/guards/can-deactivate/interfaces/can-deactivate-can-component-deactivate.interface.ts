import { CanDeactivateTypes } from '../../types/can-deactivate.type';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
