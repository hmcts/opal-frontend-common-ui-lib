import './test-setup';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed, ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeEach, vi } from 'vitest';

const ANGULAR_TESTBED_SETUP = Symbol.for('@angular/cli/testbed-setup');
const globalWithAngularTestbed = globalThis as typeof globalThis & Record<symbol, boolean | undefined>;
const frontendModuleMocks = vi.hoisted(() => ({
  govukInitAllMock: vi.fn(),
  mojInitAllMock: vi.fn(),
}));

vi.mock('govuk-frontend', () => ({
  initAll: frontendModuleMocks.govukInitAllMock,
  default: {
    initAll: frontendModuleMocks.govukInitAllMock,
  },
}));

vi.mock('@ministryofjustice/frontend/moj/all.mjs', () => ({
  initAll: frontendModuleMocks.mojInitAllMock,
  default: {
    initAll: frontendModuleMocks.mojInitAllMock,
  },
}));

beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));
afterEach(() => {
  frontendModuleMocks.govukInitAllMock.mockClear();
  frontendModuleMocks.mojInitAllMock.mockClear();
});

if (!globalWithAngularTestbed[ANGULAR_TESTBED_SETUP]) {
  globalWithAngularTestbed[ANGULAR_TESTBED_SETUP] = true;

  @NgModule({
    providers: [provideZoneChangeDetection()],
  })
  class TestModule {}

  getTestBed().initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting(), {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  });
}
