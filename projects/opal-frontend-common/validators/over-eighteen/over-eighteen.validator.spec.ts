import { TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { overEighteenValidator } from './over-eighteen.validator';
import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { describe, vi, beforeEach, it, expect } from 'vitest';

describe('overEighteenValidator', () => {
  let formGroup: FormGroup;
  let getFromFormat: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getFromFormat = vi.fn().mockName('DateService.getFromFormat');
    const dateServiceSpy = {
      getFromFormat,
    } as unknown as DateService;

    TestBed.configureTestingModule({
      providers: [{ provide: DateService, useValue: dateServiceSpy }],
    }).compileComponents();

    TestBed.inject(DateService);

    formGroup = new FormGroup(
      {
        dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
        monthOfYear: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
      },
      {
        validators: overEighteenValidator('dayOfMonth', 'monthOfYear', 'year', dateServiceSpy),
      },
    );
  });

  it('should return null when dayOfMonth is not defined', () => {
    formGroup.removeControl('dayOfMonth');
    formGroup.updateValueAndValidity();
    expect(formGroup.valid).toBeFalsy();
  });

  it('should return null when monthOfYear is not defined', () => {
    formGroup.removeControl('monthOfYear');
    formGroup.updateValueAndValidity();
    expect(formGroup.valid).toBeFalsy();
  });

  it('should return null when year is not defined', () => {
    formGroup.removeControl('year');
    formGroup.updateValueAndValidity();
    expect(formGroup.valid).toBeFalsy();
  });

  it('should return null if any control value is empty', () => {
    formGroup.setValue({ dayOfMonth: '', monthOfYear: '', year: '' });
    formGroup.updateValueAndValidity();
    expect(formGroup.valid).toBeFalsy();
  });

  it('should return { underEighteen: true } if the date is less than 18 years ago', () => {
    getFromFormat.mockReturnValue(DateTime.now().minus({ years: 17 }));

    formGroup.setValue({
      dayOfMonth: '01',
      monthOfYear: '01',
      year: (DateTime.now().year - 17).toString(),
    });

    formGroup.updateValueAndValidity();

    expect(formGroup.controls['year'].errors).toEqual({ underEighteen: true });
    expect(formGroup.valid).toBeFalsy();
    expect(formGroup.errors).toEqual({ underEighteen: true });
  });

  it('should return null if the date is 18 years ago or more', () => {
    getFromFormat.mockReturnValue(DateTime.now().minus({ years: 18 }));

    formGroup.setValue({
      dayOfMonth: '01',
      monthOfYear: '01',
      year: DateTime.now().year - 18,
    });

    formGroup.updateValueAndValidity();

    expect(formGroup.controls['year'].errors).toBeNull();
    expect(formGroup.valid).toBeTruthy();
  });

  it('should return null if the date is 18 years ago or more (singular numbers)', () => {
    getFromFormat.mockReturnValue(DateTime.now().minus({ years: 18 }));

    formGroup.setValue({
      dayOfMonth: '1',
      monthOfYear: '1',
      year: DateTime.now().year - 18,
    });

    formGroup.updateValueAndValidity();

    expect(formGroup.controls['year'].errors).toBeNull();
    expect(formGroup.valid).toBeTruthy();
  });

  it('should handle invalid date formats correctly', () => {
    getFromFormat.mockReturnValue(DateTime.invalid('Invalid date'));

    formGroup.setValue({
      dayOfMonth: '32', // Invalid day
      monthOfYear: '13', // Invalid month
      year: '2020',
    });

    formGroup.updateValueAndValidity();

    expect(formGroup.controls['year'].errors).toBeNull();
    expect(formGroup.valid).toBeTruthy();
  });
});
