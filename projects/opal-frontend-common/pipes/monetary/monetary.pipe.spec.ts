import type { MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MonetaryPipe } from './monetary.pipe';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

describe('MonetaryPipe', () => {
  let pipe: MonetaryPipe;
  let utilsService: MockedObject<UtilsService>;

  beforeEach(() => {
    const utilsServiceSpy = {
      convertToMonetaryString: vi.fn().mockName('UtilsService.convertToMonetaryString'),
    };

    TestBed.configureTestingModule({
      providers: [MonetaryPipe, { provide: UtilsService, useValue: utilsServiceSpy }],
    });

    pipe = TestBed.inject(MonetaryPipe);
    utilsService = TestBed.inject(UtilsService) as MockedObject<UtilsService>;
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a number by calling utilsService.convertToMonetaryString', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£123.45');

    const result = pipe.transform(123.45);

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith(123.45);
    expect(result).toBe('£123.45');
  });

  it('should transform a string by calling utilsService.convertToMonetaryString', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£67.89');

    const result = pipe.transform('67.89');

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith('67.89');
    expect(result).toBe('£67.89');
  });

  it('should handle zero value', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£0.00');

    const result = pipe.transform(0);

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith(0);
    expect(result).toBe('£0.00');
  });

  it('should handle negative values', () => {
    utilsService.convertToMonetaryString.mockReturnValue('-£50.00');

    const result = pipe.transform(-50);

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith(-50);
    expect(result).toBe('-£50.00');
  });

  it('should handle large values', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£1,234,567.89');

    const result = pipe.transform(1234567.89);

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith(1234567.89);
    expect(result).toBe('£1,234,567.89');
  });

  it('should handle decimal string values', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£99.99');

    const result = pipe.transform('99.99');

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith('99.99');
    expect(result).toBe('£99.99');
  });

  it('should handle integer string values', () => {
    utilsService.convertToMonetaryString.mockReturnValue('£100.00');

    const result = pipe.transform('100');

    expect(utilsService.convertToMonetaryString).toHaveBeenCalledWith('100');
    expect(result).toBe('£100.00');
  });
});
