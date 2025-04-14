import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
