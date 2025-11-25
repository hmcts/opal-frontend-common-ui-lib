import { Injectable, inject } from '@angular/core';
import { TransferStateService } from '@hmcts/opal-frontend-common/services/transfer-state-service';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly transferStateService = inject(TransferStateService);
  private readonly appInsightsService = inject(AppInsightsService);

  /**
   * Initializes the SSO (Single Sign-On) enabled state.
   * This method calls the `initializeSsoEnabled` method of the `transferStateService`.
   */
  private initializeSsoEnabled(): void {
    this.transferStateService.initializeSsoEnabled();
  }

  /**
   * Initializes the LaunchDarkly configuration.
   */
  private initializeLaunchDarkly(): void {
    this.transferStateService.initializeLaunchDarklyConfig();
  }

  /**
   * Initializes the Application Insights configuration.
   */
  private initializeAppInsights(): void {
    this.transferStateService.initializeAppInsightsConfig();
  }

  /**
   * Initializes the user state cache expiration milliseconds.
   */
  private initializeUserStateCacheExpirationMilliseconds(): void {
    this.transferStateService.initializeUserStateCacheExpirationMilliseconds();
  }

  /**
   * Initializes the application.
   * This method calls the necessary initialization functions.
   */
  public async initializeApp(): Promise<void> {
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();
    this.initializeAppInsights();
    this.initializeUserStateCacheExpirationMilliseconds();
    await this.appInsightsService.initialize();
  }
}
