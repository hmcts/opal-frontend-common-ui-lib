import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ITransferStateServerState } from '@hmcts/opal-frontend-common/services/transfer-state-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly platformId = inject(PLATFORM_ID);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly serverTransferState = inject<ITransferStateServerState | null>('serverTransferState' as any, {
    optional: true,
  });
  private readonly transferState = inject(TransferState);

  private readonly globalStore = inject(GlobalStore);
  private readonly storedServerTransferState!: ITransferStateServerState;

  constructor() {
    const storeKeyTransferState = makeStateKey<ITransferStateServerState>('serverTransferState');

    if (isPlatformBrowser(this.platformId)) {
      // get user state from transfer state if browser side
      this.serverTransferState = this.transferState.get(storeKeyTransferState, null);

      if (this.serverTransferState) {
        this.storedServerTransferState = this.serverTransferState;
      }
    } else {
      // server side: store server transfer state
      this.transferState.set(storeKeyTransferState, this.serverTransferState);
    }
  }

  /**
   * Initializes the SSO (Single Sign-On) enabled state.
   * Sets the SSO enabled state based on the stored server transfer state.
   */
  public initializeSsoEnabled(): void {
    this.globalStore.setSsoEnabled(this.storedServerTransferState?.ssoEnabled);
  }

  /**
   * Initializes the LaunchDarkly configuration by assigning the stored server transfer state's
   * launchDarklyConfig value to the globalStore's launchDarklyConfig property.
   */
  public initializeLaunchDarklyConfig(): void {
    this.globalStore.setLaunchDarklyConfig(this.storedServerTransferState?.launchDarklyConfig);
  }

  /**
   * Initializes the Application Insights configuration by assigning the stored server transfer state's
   * appInsightsConfig value to the globalStore's appInsightsConfig property.
   */
  public initializeAppInsightsConfig(): void {
    this.globalStore.setAppInsightsConfig(this.storedServerTransferState?.appInsightsConfig);
  }

  /**
   * Initializes the user state cache expiration time in milliseconds.
   * This method retrieves the `userStateCacheExpirationMilliseconds` value
   * from the stored server transfer state and sets it in the global store.
   *
   * @remarks
   * Ensure that `storedServerTransferState` is properly populated before
   * calling this method to avoid setting an undefined value.
   */
  public initializeUserStateCacheExpirationMilliseconds(): void {
    this.globalStore.setUserStateCacheExpirationMilliseconds(
      this.storedServerTransferState?.userStateCacheExpirationMilliseconds,
    );
  }
}
