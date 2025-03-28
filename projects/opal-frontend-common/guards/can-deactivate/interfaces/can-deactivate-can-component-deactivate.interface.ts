import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/types';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
