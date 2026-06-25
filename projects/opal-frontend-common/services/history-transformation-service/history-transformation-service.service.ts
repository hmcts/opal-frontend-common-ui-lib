import { Injectable } from '@angular/core';
import { IHistoryDetails } from './interfaces/history-details.interface';
import { IHistoryTransformationConfig } from './interfaces/history-transformation-service-config.interface';
import { THistoryDetailsRawItem } from './types/history-details-raw-item.type';
import { transformHistoryDetails, transformHistoryItems } from './utils/history-transformation-service.utils';

@Injectable({
  providedIn: 'root',
})
export class HistoryTransformationService {
  /**
   * Transforms a raw history item into the structured details model.
   *
   * @param item - The raw history item.
   * @param config - The domain-specific transformation configuration.
   * @returns The transformed history details.
   */
  public transformDetails(item: THistoryDetailsRawItem, config: IHistoryTransformationConfig): IHistoryDetails {
    return transformHistoryDetails(item, config);
  }

  /**
   * Transforms raw history items while preserving the rest of each item.
   *
   * @param items - The raw history items.
   * @param config - The domain-specific transformation configuration.
   * @returns The items with transformed structured details.
   */
  public transformItems<T extends THistoryDetailsRawItem>(
    items: T[],
    config: IHistoryTransformationConfig,
  ): Array<Omit<T, 'details'> & { details: IHistoryDetails }> {
    return transformHistoryItems(items, config);
  }
}
