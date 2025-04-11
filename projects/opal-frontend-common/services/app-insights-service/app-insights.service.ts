import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import { isPlatformBrowser } from '@angular/common';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Injectable({
  providedIn: 'root',
})
export class AppInsightsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private appInsights!: any;
  private isInitialized = false;
  private readonly globalStore = inject(GlobalStore);
  private readonly platformId = inject(PLATFORM_ID);

  private async initializeAppInsights(): Promise<void> {
    const { ApplicationInsights } = await import('@microsoft/applicationinsights-web');
    const config = this.globalStore.appInsightsConfig();
    if (isPlatformBrowser(this.platformId) && config.enabled) {
      this.appInsights = new ApplicationInsights({
        config: {
          connectionString: config.connectionString,
          enableAutoRouteTracking: true,
        },
      });

      this.appInsights.addTelemetryInitializer(this.telemetryInitializer.bind(this));
      this.appInsights.loadAppInsights();

      this.isInitialized = true;
    }
  }

  private telemetryInitializer(envelope: ITelemetryItem): void {
    envelope.tags = envelope.tags || {};
    const config = this.globalStore.appInsightsConfig();
    if (config.enabled) {
      envelope.tags['ai.cloud.role'] = config.cloudRoleName!;
    }
  }

  public logPageView(name?: string, url?: string): void {
    const config = this.globalStore.appInsightsConfig();
    if (!this.isInitialized || !config.enabled) {
      return;
    }
    this.appInsights.trackPageView({ name, uri: url });
  }

  public logException(exception: Error, severityLevel?: number): void {
    const config = this.globalStore.appInsightsConfig();
    if (!this.isInitialized || !config.enabled) {
      return;
    }
    this.appInsights.trackException({ exception, severityLevel });
  }

  public async initialize(): Promise<void> {
    await this.initializeAppInsights();
  }
}
