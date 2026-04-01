import { TestBed } from '@angular/core/testing';
import { runHasFlowStateGuardWithContext } from './run-has-flow-state-guard-with-context';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect } from 'vitest';

describe('runHasFlowStateGuardWithContext', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return boolean result directly', async () => {
    const guardFn = () => true;
    const result = await runHasFlowStateGuardWithContext(guardFn);
    expect(result).toBe(true);
  });

  it('should handle Promise result', async () => {
    const guardFn = () => Promise.resolve(false);
    const result = await runHasFlowStateGuardWithContext(guardFn);
    expect(result).toBe(false);
  });

  it('should handle Observable result', async () => {
    const guardFn = () => of(true);
    const result = await runHasFlowStateGuardWithContext(guardFn);
    expect(result).toBe(true);
  });
});
