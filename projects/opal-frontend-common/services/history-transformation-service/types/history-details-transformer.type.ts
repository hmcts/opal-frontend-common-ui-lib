import { IHistoryDetails } from '../interfaces/history-details.interface';
import { THistoryDetailsRawItem } from './history-details-raw-item.type';

export type THistoryDetailsTransformer = (item: THistoryDetailsRawItem) => IHistoryDetails;
