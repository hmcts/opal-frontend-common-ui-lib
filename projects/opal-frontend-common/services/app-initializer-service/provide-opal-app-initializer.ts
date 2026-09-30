import { inject, makeStateKey, provideAppInitializer, TransferState } from '@angular/core';
import { AppInitializerService } from './app-initializer.service';

const SERVER_TRANSFER_STATE_KEY = makeStateKey<unknown>('serverTransferState');

/**
 * Initializes the OPAL browser application after server configuration is available.
 *
 * Waiting for the initializer ensures Application Insights is loaded before the
 * application makes its initial HTTP requests, allowing their trace context to be
 * propagated to downstream services.
 */
export function provideOpalAppInitializer() {
  return provideAppInitializer(() => {
    const appInitializerService = inject(AppInitializerService);
    const transferState = inject(TransferState);

    // `ng serve` does not render on the server, so there is no server configuration to initialise.
    if (!transferState.hasKey(SERVER_TRANSFER_STATE_KEY)) {
      return;
    }

    return appInitializerService.initializeApp();
  });
}
