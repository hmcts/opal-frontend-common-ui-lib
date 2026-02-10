import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapitalisationDirective } from './capitalisation.directive';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  template: `
    <opal-lib-govuk-text-input
      [control]="control"
      [opalLibCapitaliseAllCharacters]="control"
      inputId="test-id"
      inputName="test-name"
      labelText="Test label"
    ></opal-lib-govuk-text-input>
  `,
  standalone: true,
  imports: [GovukTextInputComponent, CapitalisationDirective, ReactiveFormsModule],
})
class WrappedTestComponent {
  control = new FormControl('');
}

describe('CapitalisationDirective', () => {
  let mockUtilsService: UtilsService;
  let upperCaseAllLetters: ReturnType<typeof vi.fn>;
  let fixture: ComponentFixture<WrappedTestComponent> | null;
  let testComponent: WrappedTestComponent;

  beforeEach(async () => {
    upperCaseAllLetters = vi.fn().mockName('UtilsService.upperCaseAllLetters');
    mockUtilsService = {
      upperCaseAllLetters,
    } as unknown as UtilsService;
    upperCaseAllLetters.mockImplementation((value: string) => value.toUpperCase());

    await TestBed.configureTestingModule({
      imports: [WrappedTestComponent, ReactiveFormsModule],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WrappedTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should capitalise control value in real-time', () => {
    testComponent.control.setValue('test');
    expect(upperCaseAllLetters).toHaveBeenCalled();
    expect(testComponent.control.value).toBe('TEST');
  });

  it('should not capitalise if control value is empty', () => {
    testComponent.control.setValue('');
    expect(upperCaseAllLetters).not.toHaveBeenCalled();
    expect(testComponent.control.value).toBe('');
  });
});

describe('CapitalisationDirective when used without form control binding', () => {
  let mockUtilsService: UtilsService;
  let upperCaseAllLetters: ReturnType<typeof vi.fn>;

  @Component({
    template: `<input type="text" [opalLibCapitaliseAllCharacters]="control" />`,
    standalone: true,
    imports: [CapitalisationDirective],
  })
  class MissingControlComponent {
    control = undefined as unknown as AbstractControl;
  }

  beforeEach(async () => {
    upperCaseAllLetters = vi.fn().mockName('UtilsService.upperCaseAllLetters');
    mockUtilsService = {
      upperCaseAllLetters,
    } as unknown as UtilsService;
    upperCaseAllLetters.mockImplementation((value: string) => value.toUpperCase());

    await TestBed.configureTestingModule({
      imports: [MissingControlComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();
  });

  it('should not throw or subscribe if control is missing', () => {
    const missingFixture = TestBed.createComponent(MissingControlComponent);
    missingFixture.detectChanges();

    expect(upperCaseAllLetters).not.toHaveBeenCalled();
  });
});
