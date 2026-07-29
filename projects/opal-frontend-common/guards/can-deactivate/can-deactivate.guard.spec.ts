import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from './interfaces/can-deactivate-can-component-deactivate.interface';
import { canDeactivateGuard, canDeactivateInformationLossGuard } from './can-deactivate.guard';
import { describe, beforeEach, it, vi, expect } from 'vitest';

describe('canDeactivateGuard', () => {
  let mockComponent: ICanDeactivateCanComponentDeactivate;
  let mockCurrentRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    vi.restoreAllMocks();
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
    expect(window.confirm).toHaveBeenCalledWith(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });

  it('should return true if canDeactivate method of component returns false and user clicks OK', () => {
    mockComponent = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };

    vi.spyOn(globalThis, 'confirm').mockReturnValue(true); // Simulate user clicking OK

    const result = canDeactivateGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState);

    expect(result).toBe(true);
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    );
  });

  describe('canDeactivateInformationLossGuard', () => {
    it('should return true without displaying a confirmation if the component can deactivate', () => {
      mockComponent = {
        canDeactivate: vi.fn().mockReturnValue(true),
      };
      const confirmSpy = vi.spyOn(globalThis, 'confirm');

      const result = canDeactivateInformationLossGuard(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState,
      );

      expect(result).toBe(true);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
      expect(confirmSpy).not.toHaveBeenCalled();
    });

    it.each([
      { confirmationResult: false, expectedResult: false },
      { confirmationResult: true, expectedResult: true },
    ])(
      'should return $expectedResult when the confirmation returns $confirmationResult',
      ({ confirmationResult, expectedResult }) => {
        mockComponent = {
          canDeactivate: vi.fn().mockReturnValue(false),
        };
        vi.spyOn(globalThis, 'confirm').mockReturnValue(confirmationResult);

        const result = canDeactivateInformationLossGuard(
          mockComponent,
          mockCurrentRoute,
          mockCurrentState,
          mockNextState,
        );

        expect(result).toBe(expectedResult);
        expect(mockComponent.canDeactivate).toHaveBeenCalled();
        expect(window.confirm).toHaveBeenCalledWith(
          'WARNING: Are you sure you want to cancel? Any information you entered will be lost.',
        );
      },
    );
  });
});
