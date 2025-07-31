import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

export const TRANSFORM_ITEM_DEFAULTS: Pick<ITransformItem, 'dateConfig' | 'timeConfig'> = {
  dateConfig: null,
  timeConfig: null,
};
