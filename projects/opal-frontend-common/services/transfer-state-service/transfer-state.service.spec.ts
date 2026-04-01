import { TestBed } from '@angular/core/testing';
import { TransferStateService } from './transfer-state.service';
import { TRANSFER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/transfer-state-service/mocks';
import { PLATFORM_ID, makeStateKey } from '@angular/core';
import { ITransferStateServerState } from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { describe, beforeEach, it, expect } from 'vitest';

describe('TransferStateService', () => {
  let service: TransferStateService;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: 'serverTransferState',
          useValue: TRANSFER_STATE_MOCK,
        },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
    service = TestBed.inject(TransferStateService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).storedServerTransferState = TRANSFER_STATE_MOCK;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the transfer state from the server', () => {
    const storeKeyTransferState = makeStateKey<ITransferStateServerState>('serverTransferState');
    const serverTransferState = service['transferState'].get(storeKeyTransferState, undefined);
    expect(serverTransferState).toEqual(TRANSFER_STATE_MOCK);
  });

  it('should initialize SSO enabled', () => {
    service.initializeSsoEnabled();

    expect(globalStore.ssoEnabled()).toEqual(service['storedServerTransferState'].ssoEnabled);
  });

  it('should initialize launch darkly', () => {
    service.initializeLaunchDarklyConfig();

    expect(globalStore.launchDarklyConfig()).toEqual(service['storedServerTransferState'].launchDarklyConfig);
  });

  it('should initialize app insights', () => {
    service.initializeAppInsightsConfig();

    expect(globalStore.appInsightsConfig()).toEqual(service['storedServerTransferState'].appInsightsConfig);
  });

  it('should initialize user state cache expiration milliseconds', () => {
    service.initializeUserStateCacheExpirationMilliseconds();

    expect(globalStore.userStateCacheExpirationMilliseconds()).toEqual(
      service['storedServerTransferState'].userStateCacheExpirationMilliseconds,
    );
  });
});
