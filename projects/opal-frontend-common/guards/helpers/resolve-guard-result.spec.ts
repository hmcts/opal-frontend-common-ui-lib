import { UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { resolveGuardResult } from './resolve-guard-result';

describe('resolveGuardResult', () => {
  it('should resolve a synchronous guard result', async () => {
    await expect(resolveGuardResult(true)).resolves.toBe(true);
  });

  it('should resolve a promise guard result', async () => {
    await expect(resolveGuardResult(Promise.resolve(false))).resolves.toBe(false);
  });

  it('should resolve an observable guard result', async () => {
    const urlTree = new UrlTree();

    await expect(resolveGuardResult(of(urlTree))).resolves.toBe(urlTree);
  });
});
