import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TrimLeadingTrailingWhitespaceDirective } from './trim-leading-trailing-whitespace.directive';

@Component({
  template: `
    <div [opalLibTrimLeadingTrailingWhitespace]="control">
      <input type="text" [formControl]="control" />
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, TrimLeadingTrailingWhitespaceDirective],
})
class WrappedTestComponent {
  control = new FormControl<string | null>(null);
}

describe('TrimLeadingTrailingWhitespaceDirective', () => {
  let fixture: ComponentFixture<WrappedTestComponent>;
  let testComponent: WrappedTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrappedTestComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WrappedTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  function dispatchFocusOut(): void {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.dispatchEvent(new Event('focusout', { bubbles: true }));
    fixture.detectChanges();
  }

  it('should remove leading whitespace on focusout', () => {
    testComponent.control.setValue('  test');

    dispatchFocusOut();

    expect(testComponent.control.value).toBe('test');
  });

  it('should remove trailing whitespace on focusout', () => {
    testComponent.control.setValue('test  ');

    dispatchFocusOut();

    expect(testComponent.control.value).toBe('test');
  });

  it('should remove leading and trailing whitespace together on focusout', () => {
    testComponent.control.setValue('  test  ');

    dispatchFocusOut();

    expect(testComponent.control.value).toBe('test');
  });

  it('should preserve internal whitespace on focusout', () => {
    testComponent.control.setValue('  test   value  ');

    dispatchFocusOut();

    expect(testComponent.control.value).toBe('test   value');
  });

  it('should handle empty, null, and non-string values safely', () => {
    testComponent.control.setValue('');
    dispatchFocusOut();
    expect(testComponent.control.value).toBe('');

    testComponent.control.setValue(null);
    dispatchFocusOut();
    expect(testComponent.control.value).toBeNull();

    testComponent.control.setValue(123 as unknown as string);
    dispatchFocusOut();
    expect(testComponent.control.value).toBe(123 as unknown as string);
  });

  it('should not update the control when trimming produces no change', () => {
    const setValueSpy = vi.spyOn(testComponent.control, 'setValue');

    testComponent.control.setValue('test');
    setValueSpy.mockClear();

    dispatchFocusOut();

    expect(setValueSpy).not.toHaveBeenCalled();
    expect(testComponent.control.value).toBe('test');
  });
});
