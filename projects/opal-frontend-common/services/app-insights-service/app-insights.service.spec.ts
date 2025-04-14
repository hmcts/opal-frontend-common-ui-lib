import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import { AppInsightsService } from './app-insights.service';
import { TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK } from '@hmcts/opal-frontend-common/services/transfer-state-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';

describe('AppInsightsService', () => {
  let service: AppInsightsService;
  let trackPageViewSpy: jasmine.Spy;
  let trackExceptionSpy: jasmine.Spy;
  let globalStore: GlobalStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(AppInsightsService);
    globalStore = TestBed.inject(GlobalStore);
    globalStore.setAppInsightsConfig(TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not initialize Application Insights on server', () => {
    TestBed.resetTestingModule();
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    service = TestBed.inject(AppInsightsService);

    expect(service).toBeDefined();
  });

  it('should correctly set telemetry initializer', () => {
    const mockEnvelope: ITelemetryItem = { name: 'Test Event', tags: {} };

    service['telemetryInitializer'](mockEnvelope);

    expect(mockEnvelope.tags).toEqual({ 'ai.cloud.role': 'opal-frontend' });
  });

  it('should correctly set telemetry initializer - tag undefined', () => {
    const mockEnvelope: ITelemetryItem = {
      name: 'Test Event',
      tags: undefined,
    };

    service['telemetryInitializer'](mockEnvelope);

    expect(mockEnvelope.tags).toEqual({ 'ai.cloud.role': 'opal-frontend' });
  });

  it('should track a page view', async () => {
    const pageName = 'Test Page';
    const pageUrl = '/test-url';
    await service.initialize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trackPageViewSpy = spyOn((service as any).appInsights, 'trackPageView');

    service.logPageView(pageName, pageUrl);

    expect(trackPageViewSpy).toHaveBeenCalledTimes(1);
    expect(trackPageViewSpy).toHaveBeenCalledWith({
      name: pageName,
      uri: pageUrl,
    });
  });

  it('should track an exception', async () => {
    const error = new Error('Test Error');
    const severityLevel = 2;
    await service.initialize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trackExceptionSpy = spyOn((service as any).appInsights, 'trackException');

    service.logException(error, severityLevel);

    expect(trackExceptionSpy).toHaveBeenCalledTimes(1);
    expect(trackExceptionSpy).toHaveBeenCalledWith({
      exception: error,
      severityLevel,
    });
  });

  it('should not track a page view if appInsightsConfig.enabled is false', () => {
    TestBed.resetTestingModule();
    service = TestBed.inject(AppInsightsService);
    globalStore = TestBed.inject(GlobalStore);
    globalStore.setAppInsightsConfig({ ...TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK, enabled: false });
    service.initialize();

    expect(() => service.logPageView('Test Page', '/test-url')).not.toThrow();
  });

  it('should not track an exception if appInsightsConfig.enabled is false', () => {
    TestBed.resetTestingModule();
    service = TestBed.inject(AppInsightsService);
    globalStore = TestBed.inject(GlobalStore);
    globalStore.setAppInsightsConfig({ ...TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK, enabled: false });
    service.initialize();

    const error = new Error('Test Error');
    expect(() => service.logException(error)).not.toThrow();
  });
});
