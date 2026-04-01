import { TestBed } from '@angular/core/testing';
import { AppInitializerService } from './app-initializer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('AppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize LaunchDarkly', () => {
    vi.spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');

    service['initializeLaunchDarkly']();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
  });

  it('should initialize SSO enabled', () => {
    vi.spyOn(service['transferStateService'], 'initializeSsoEnabled');
    service['initializeSsoEnabled']();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
  });

  it('should initialize the SSO enabled and LaunchDarkly', async () => {
    vi.spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');
    vi.spyOn(service['transferStateService'], 'initializeSsoEnabled');
    vi.spyOn(service['appInsightsService'], 'initialize').mockResolvedValue();

    await service.initializeApp();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
    expect(service['appInsightsService'].initialize).toHaveBeenCalled();
  });
});
