import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from './interfaces/can-deactivate-can-component-deactivate.interface';
import { canDeactivateGuard } from './can-deactivate.guard';
import { describe, beforeEach, it, vi, expect } from 'vitest';
import { CAN_DEACTIVATE_WARNING_MESSAGE } from './constants/can-deactivate-warning-message.constant';

describe('canDeactivateGuard', () => {
  let mockComponent: ICanDeactivateCanComponentDeactivate;
  let mockCurrentRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    mockCurrentRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = {} as RouterStateSnapshot;
    mockNextState = {} as RouterStateSnapshot;
  });

  it('should return true if canDeactivate method of component returns true', () => {
    mockComponent = {
      canDeactivate: vi.fn().mockReturnValue(true),
    };

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBe(true);
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
  });

  it('should return false if canDeactivate method of component returns false and user clicks Cancel', () => {
    mockComponent = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };

    vi.spyOn(globalThis, 'confirm').mockReturnValue(false); // Simulate user clicking Cancel

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBe(false);
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(CAN_DEACTIVATE_WARNING_MESSAGE);
  });

  it('should return true if canDeactivate method of component returns false and user clicks OK', () => {
    mockComponent = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };

    vi.spyOn(globalThis, 'confirm').mockReturnValue(true); // Simulate user clicking OK

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBe(true);
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(CAN_DEACTIVATE_WARNING_MESSAGE);
  });
});
