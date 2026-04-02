import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojDatePickerComponent } from './moj-date-picker.component';
import { FormControl } from '@angular/forms';
import { vi, describe, beforeEach, it, expect } from 'vitest';

type DatePickerModuleLoaderHost = {
  loadDatePickerModule: () => Promise<{ initAll: () => void }>;
};

describe('MojDatePickerComponent', () => {
  let component: MojDatePickerComponent;
  let fixture: ComponentFixture<MojDatePickerComponent>;
  let formControl: FormControl;
  let initAllSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojDatePickerComponent);
    component = fixture.componentInstance;
    initAllSpy = vi.fn();
    (component as unknown as DatePickerModuleLoaderHost).loadDatePickerModule = vi
      .fn()
      .mockResolvedValue({ initAll: initAllSpy });

    formControl = new FormControl(null);

    component.labelText = 'Test Date Picker Label';
    component.inputId = 'datePickerId';
    component.inputName = 'datePickerName';
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initAll on date picker library', async () => {
    initAllSpy.mockClear();
    component.configureDatePicker();
    await Promise.resolve();
    expect(initAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should build describedBy from hint and error', () => {
    component.hintText = 'Hint text';
    component.errors = 'Error message';

    expect(component.describedBy).toBe('datePickerId-hint datePickerId-error-message');
  });

  it('should not call loadDatePickerModule after the component is destroyed', () => {
    const rawFixture = TestBed.createComponent(MojDatePickerComponent);
    const rawComponent = rawFixture.componentInstance;
    const loadDatePickerModuleSpy = vi.fn().mockResolvedValue({ initAll: initAllSpy });

    (rawComponent as unknown as DatePickerModuleLoaderHost).loadDatePickerModule = loadDatePickerModuleSpy;

    rawComponent.ngOnDestroy();
    rawComponent.configureDatePicker();

    expect(loadDatePickerModuleSpy).not.toHaveBeenCalled();
  });

  it('should not call initAll after the component is destroyed', async () => {
    let resolveModule!: (value: { initAll: () => void }) => void;
    initAllSpy.mockClear();

    (component as unknown as DatePickerModuleLoaderHost).loadDatePickerModule = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveModule = resolve;
      }),
    );

    component.configureDatePicker();
    component.ngOnDestroy();
    resolveModule({ initAll: initAllSpy as unknown as () => void });

    await Promise.resolve();

    expect(initAllSpy).not.toHaveBeenCalled();
  });

  it('should load the date picker module via loadDatePickerModule', async () => {
    const rawFixture = TestBed.createComponent(MojDatePickerComponent);
    const rawComponent = rawFixture.componentInstance;

    const module = await (rawComponent as unknown as DatePickerModuleLoaderHost).loadDatePickerModule();

    expect(typeof module.initAll).toBe('function');
  });

  it('should update selectedDate and emit dateChange event when changeDate is called', () => {
    vi.spyOn(component.dateChange, 'emit');
    const newDate = '01/01/2024';

    component['setDateValue'](newDate);

    expect(component.dateChange.emit).toHaveBeenCalledWith(newDate);
  });

  it('should update selectedDate and emit dateChange event when changeDate is called - incorrect date', () => {
    vi.spyOn(component.dateChange, 'emit');
    const newDate = '32/13/2024';

    component['setDateValue'](newDate);

    expect(component.dateChange.emit).toHaveBeenCalledWith(newDate);
  });

  it('should test concatenateDisabledDates when supplied', () => {
    component.disabledDates = ['01/01/2024', '01/02/2024'];

    component.ngOnInit();

    expect(component.disabledDatesConcatenated).toEqual('01/01/2024 01/02/2024');
  });

  it('should set aria-describedby with hint only', () => {
    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#datePickerId');
    expect(input.getAttribute('aria-describedby')).toBe('datePickerId-hint');
  });

  it('should set aria-describedby with error only', () => {
    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#datePickerId');
    expect(input.getAttribute('aria-describedby')).toBe('datePickerId-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#datePickerId');
    expect(input.getAttribute('aria-describedby')).toBe('datePickerId-hint datePickerId-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', () => {
    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#datePickerId');
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});
