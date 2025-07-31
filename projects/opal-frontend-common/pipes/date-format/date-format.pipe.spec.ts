import { TestBed } from '@angular/core/testing';
import { DateFormatPipe } from './date-format.pipe';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;
  let dateServiceSpy: jasmine.SpyObj<DateService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateFormatPipe,
        { provide: DateService, useValue: jasmine.createSpyObj('DateService', ['getFromFormatToFormat']) },
      ],
    });
    pipe = TestBed.inject(DateFormatPipe);
    dateServiceSpy = TestBed.inject(DateService) as jasmine.SpyObj<DateService>;
  });

  it('should format a valid date using the given formats', () => {
    dateServiceSpy.getFromFormatToFormat.and.returnValue('1 Jan 2024');

    const result = pipe.transform('2024-01-01', 'yyyy-MM-dd', 'd MMM yyyy');

    expect(dateServiceSpy.getFromFormatToFormat).toHaveBeenCalledWith('2024-01-01', 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('1 Jan 2024');
  });

  it('should return "—" if the input value is null', () => {
    const result = pipe.transform(null, 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('—');
    expect(dateServiceSpy.getFromFormatToFormat).not.toHaveBeenCalled();
  });

  it('should return "—" if the input value is undefined', () => {
    const result = pipe.transform(undefined, 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('—');
    expect(dateServiceSpy.getFromFormatToFormat).not.toHaveBeenCalled();
  });

  it('should return empty string if formatting fails', () => {
    dateServiceSpy.getFromFormatToFormat.and.returnValue('');
    const result = pipe.transform('invalid-date', 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('');
  });
});
