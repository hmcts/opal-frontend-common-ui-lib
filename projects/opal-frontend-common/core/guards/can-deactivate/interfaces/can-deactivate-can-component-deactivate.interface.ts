import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/core/types';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
