import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HistoryTransformationService } from './history-transformation-service.service';
import { HISTORY_NOTE_DETAILS_MOCK } from './mocks/history-note-details.mock';
import { HISTORY_NOTE_ITEM_MOCK } from './mocks/history-note-item.mock';
import { HISTORY_STRUCTURED_NOTE_ITEM_MOCK } from './mocks/history-structured-note-item.mock';
import { HISTORY_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK } from './mocks/history-structured-note-transformed-item.mock';
import { HISTORY_TRANSFORMATION_CONFIG_MOCK } from './mocks/history-transformation-config.mock';

describe('HistoryTransformationService', () => {
  let service: HistoryTransformationService;

  beforeEach(() => {
    service = TestBed.inject(HistoryTransformationService);
  });

  it('should transform a raw item through the configured transformer', () => {
    const result = service.transformDetails(HISTORY_NOTE_ITEM_MOCK, HISTORY_TRANSFORMATION_CONFIG_MOCK);

    expect(result).toEqual(HISTORY_NOTE_DETAILS_MOCK);
  });

  it('should transform raw item arrays by replacing the details value', () => {
    const result = service.transformItems([HISTORY_STRUCTURED_NOTE_ITEM_MOCK], HISTORY_TRANSFORMATION_CONFIG_MOCK);

    expect(result).toEqual([HISTORY_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK]);
  });
});
