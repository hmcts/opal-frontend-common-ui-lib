import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapitalisationDirective } from './capitalisation.directive';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('should not update the control when the value is already uppercase', () => {
    const setValueSpy = vi.spyOn(testComponent.control, 'setValue');

    testComponent.control.setValue('TEST');

    expect(upperCaseAllLetters).toHaveBeenCalledWith('TEST');
    expect(setValueSpy).toHaveBeenCalledTimes(1);
    expect(testComponent.control.value).toBe('TEST');
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

@Component({
  template: `
    <ng-container [opalLibCapitaliseAllCharacters]="control"></ng-container>
    <opal-lib-govuk-text-input
      [control]="control"
      inputId="container-reference"
      inputName="container-reference"
      labelText="Reference"
    ></opal-lib-govuk-text-input>
  `,
  imports: [GovukTextInputComponent, CapitalisationDirective],
})
class ContainerTestComponent {
  control = new FormControl('');
}

@Component({
  template: `<textarea
    aria-label="Reference"
    [formControl]="control"
    [opalLibCapitaliseAllCharacters]="control"
  ></textarea>`,
  imports: [ReactiveFormsModule, CapitalisationDirective],
})
class TextareaTestComponent {
  control = new FormControl('');
}

@Component({
  template: `<input
    aria-label="Email"
    type="email"
    [formControl]="control"
    [opalLibCapitaliseAllCharacters]="control"
  />`,
  imports: [ReactiveFormsModule, CapitalisationDirective],
})
class EmailTestComponent {
  control = new FormControl('');
}

describe('CapitalisationDirective editing', () => {
  const hosts: { name: string; component: Type<WrappedTestComponent> }[] = [
    { name: 'GOV.UK component', component: WrappedTestComponent },
    { name: 'container', component: ContainerTestComponent },
    { name: 'textarea', component: TextareaTestComponent },
  ];

  for (const host of hosts) {
    describe(host.name, () => {
      let editingFixture: ComponentFixture<WrappedTestComponent>;
      let input: HTMLInputElement | HTMLTextAreaElement;

      beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [host.component] }).compileComponents();
        editingFixture = TestBed.createComponent(host.component);
        editingFixture.detectChanges();
        input = editingFixture.nativeElement.querySelector('input, textarea');
      });

      it.each([
        { start: 2, end: 2, characters: 'xy', expected: 'ABXYCD', caret: 4 },
        { start: 1, end: 3, characters: 'xy', expected: 'AXYD', caret: 3 },
        { start: 2, end: 2, characters: 'ßy', expected: 'ABSSYCD', caret: 5 },
      ])('keeps the editing position for $characters at $start–$end', (example) => {
        input.focus();
        input.value = 'ABCD';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.setSelectionRange(example.start, example.end);

        for (const character of example.characters) {
          input.setRangeText(character, input.selectionStart!, input.selectionEnd!, 'end');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        expect(input.value).toBe(example.expected);
        expect(editingFixture.componentInstance.control.value).toBe(example.expected);
        expect(input.selectionStart).toBe(example.caret);
        expect(input.selectionEnd).toBe(example.caret);
      });

      it('preserves a backward selection when uppercasing', () => {
        input.focus();
        input.value = 'abcd';
        input.setSelectionRange(1, 3, 'backward');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        expect(input.value).toBe('ABCD');
        expect(input.selectionStart).toBe(1);
        expect(input.selectionEnd).toBe(3);
        expect(input.selectionDirection).toBe('backward');
      });
    });
  }

  describe('control and focus boundaries', () => {
    let editingFixture: ComponentFixture<WrappedTestComponent>;
    let input: HTMLInputElement;
    let unrelatedInput: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [WrappedTestComponent, EmailTestComponent] }).compileComponents();
      editingFixture = TestBed.createComponent(WrappedTestComponent);
      unrelatedInput = document.createElement('input');
      document.body.append(unrelatedInput);
    });

    afterEach(() => {
      unrelatedInput.remove();
    });

    it('preserves saved mixed-case values on initial render', () => {
      editingFixture.componentInstance.control.setValue('Mixed reference');
      editingFixture.detectChanges();
      input = editingFixture.nativeElement.querySelector('input');

      expect(input.value).toBe('Mixed reference');
      expect(editingFixture.componentInstance.control.value).toBe('Mixed reference');
    });

    it('leaves an unrelated focused input and its selection unchanged', () => {
      editingFixture.detectChanges();
      unrelatedInput.value = 'abcd';
      unrelatedInput.focus();
      unrelatedInput.setSelectionRange(1, 3, 'backward');

      editingFixture.componentInstance.control.setValue('abcd');

      expect(editingFixture.componentInstance.control.value).toBe('ABCD');
      expect(document.activeElement).toBe(unrelatedInput);
      expect(unrelatedInput.value).toBe('abcd');
      expect(unrelatedInput.selectionStart).toBe(1);
      expect(unrelatedInput.selectionEnd).toBe(3);
      expect(unrelatedInput.selectionDirection).toBe('backward');
    });

    it('keeps focus moved by another control change handler', () => {
      editingFixture.detectChanges();
      input = editingFixture.nativeElement.querySelector('input');
      input.focus();
      editingFixture.componentInstance.control.registerOnChange(() => unrelatedInput.focus());
      unrelatedInput.value = 'Other reference';
      unrelatedInput.setSelectionRange(1, 3, 'backward');

      input.value = 'abcd';
      input.setSelectionRange(1, 3, 'backward');
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(editingFixture.componentInstance.control.value).toBe('ABCD');
      expect(document.activeElement).toBe(unrelatedInput);
      expect(unrelatedInput.selectionStart).toBe(1);
      expect(unrelatedInput.selectionEnd).toBe(3);
      expect(unrelatedInput.selectionDirection).toBe('backward');
    });

    it('defaults to no direction for an incomplete document selection implementation', () => {
      editingFixture.detectChanges();
      input = editingFixture.nativeElement.querySelector('input');
      input.focus();
      input.value = 'abcd';
      input.setSelectionRange(1, 3, 'backward');
      // Exercise the defensive fallback for document implementations that omit selection direction.
      const direction = vi.spyOn(input, 'selectionDirection', 'get').mockReturnValueOnce(null);

      input.dispatchEvent(new Event('input', { bubbles: true }));
      direction.mockRestore();

      expect(input.value).toBe('ABCD');
      expect(editingFixture.componentInstance.control.value).toBe('ABCD');
      expect(input.selectionStart).toBe(1);
      expect(input.selectionEnd).toBe(3);
      expect(input.selectionDirection).toBe('none');
    });

    it('uppercases an email input that does not support text selection', () => {
      const emailFixture = TestBed.createComponent(EmailTestComponent);
      emailFixture.detectChanges();
      const email = emailFixture.nativeElement.querySelector('input') as HTMLInputElement;
      email.focus();
      email.value = 'example@example.test';

      expect(() => email.dispatchEvent(new Event('input', { bubbles: true }))).not.toThrow();
      expect(email.value).toBe('EXAMPLE@EXAMPLE.TEST');
      expect(emailFixture.componentInstance.control.value).toBe('EXAMPLE@EXAMPLE.TEST');
      expect(email.selectionStart).toBeNull();
    });

    it('does not normalise non-string values', () => {
      editingFixture.detectChanges();
      editingFixture.componentInstance.control.setValue(null);

      expect(editingFixture.componentInstance.control.value).toBeNull();
    });

    it('stops normalising the control after the directive is destroyed', () => {
      editingFixture.detectChanges();
      const control = editingFixture.componentInstance.control;
      editingFixture.destroy();

      control.setValue('Mixed reference');

      expect(control.value).toBe('Mixed reference');
    });
  });
});
