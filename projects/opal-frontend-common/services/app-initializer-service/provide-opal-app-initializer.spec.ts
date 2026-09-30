import { ApplicationInitStatus, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppInitializerService } from './app-initializer.service';
import { provideOpalAppInitializer } from './provide-opal-app-initializer';

describe('provideOpalAppInitializer', () => {
  const initializeApp = vi.fn<() => Promise<void>>();
  const hasServerTransferState = vi.spyOn(TransferState.prototype, 'hasKey');

  beforeEach(() => {
    initializeApp.mockReset();
    hasServerTransferState.mockReset();
    hasServerTransferState.mockReturnValue(true);

    TestBed.configureTestingModule({
      providers: [
        provideOpalAppInitializer(),
        {
          provide: AppInitializerService,
          useValue: { initializeApp },
        },
      ],
    });
  });

  it('waits for application initialization to complete', async () => {
    let resolveInitialization!: () => void;
    const initializationPromise = new Promise<void>((resolve) => {
      resolveInitialization = resolve;
    });
    initializeApp.mockReturnValue(initializationPromise);

    const applicationInitStatus = TestBed.inject(ApplicationInitStatus);

    expect(initializeApp).toHaveBeenCalledOnce();
    expect(applicationInitStatus.done).toBe(false);

    resolveInitialization();
    await applicationInitStatus.donePromise;

    expect(applicationInitStatus.done).toBe(true);
  });

  it('does not initialize without server transfer state', async () => {
    hasServerTransferState.mockReturnValue(false);

    const applicationInitStatus = TestBed.inject(ApplicationInitStatus);

    await applicationInitStatus.donePromise;

    expect(initializeApp).not.toHaveBeenCalled();
  });
});
