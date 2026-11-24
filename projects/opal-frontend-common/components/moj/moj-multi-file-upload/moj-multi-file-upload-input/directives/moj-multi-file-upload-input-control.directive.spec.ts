import { Component, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MojMultiFileUploadInputControlDirective } from './moj-multi-file-upload-input-control.directive';

@Component({
  selector: 'opal-lib-file-input-control-test-host',
  imports: [ReactiveFormsModule, MojMultiFileUploadInputControlDirective],
  template: `
    <form [formGroup]="form" (submit)="$event.preventDefault()">
      <input
        type="file"
        opalLibMojMultiFileUploadInputControl
        formControlName="files"
        [maxFiles]="maxFiles"
        (filesSelected)="onFilesSelected($event)"
      />
    </form>
  `,
})
class FileInputControlTestHostComponent {
  public maxFiles: number | undefined;
  public form = new FormGroup({ files: new FormControl<readonly File[] | null>(null) });
  public readonly selections: (readonly File[])[] = [];
  public readonly valuesAtSelection: (readonly File[] | null)[] = [];

  public onFilesSelected(files: readonly File[]): void {
    this.selections.push(files);
    this.valuesAtSelection.push(this.form.controls.files.value);
  }
}

@Component({
  selector: 'opal-lib-unbound-file-input-test-host',
  imports: [MojMultiFileUploadInputControlDirective],
  template: `<input type="file" opalLibMojMultiFileUploadInputControl (filesSelected)="selections.push($event)" />`,
})
class UnboundFileInputTestHostComponent {
  public readonly selections: (readonly File[])[] = [];
}

describe('MojMultiFileUploadInputControlDirective', () => {
  let fixture: ComponentFixture<FileInputControlTestHostComponent>;
  let host: FileInputControlTestHostComponent;
  let unboundFixture: ComponentFixture<UnboundFileInputTestHostComponent> | undefined;

  const input = (): HTMLInputElement => fixture.nativeElement.querySelector('input');
  const accessor = (): MojMultiFileUploadInputControlDirective =>
    fixture.debugElement
      .query(By.directive(MojMultiFileUploadInputControlDirective))
      .injector.get(MojMultiFileUploadInputControlDirective);
  const selectFiles = (...files: File[]): void => {
    Object.defineProperty(input(), 'files', { configurable: true, value: files });
    input().dispatchEvent(new Event('change', { bubbles: true }));
  };
  const createFiles = (count: number): File[] =>
    Array.from({ length: count }, (_, index) => new File(['content'], `document-${index}.csv`));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputControlTestHostComponent, UnboundFileInputTestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FileInputControlTestHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    unboundFixture?.destroy();
    unboundFixture = undefined;
  });

  it('safely emits selections and handles blur before form callbacks are registered', () => {
    unboundFixture = TestBed.createComponent(UnboundFileInputTestHostComponent);
    unboundFixture.detectChanges();
    const nativeInput: HTMLInputElement = unboundFixture.nativeElement.querySelector('input');
    const directiveElement = unboundFixture.debugElement.query(By.directive(MojMultiFileUploadInputControlDirective));
    const directive = directiveElement.injector.get(MojMultiFileUploadInputControlDirective);
    expect(directiveElement.injector.get(NG_VALUE_ACCESSOR)).toContain(directive);
    expect(directiveElement.injector.get(NG_VALIDATORS)).toContain(directive);
    const document = new File(['content'], 'unbound.csv');
    Object.defineProperty(nativeInput, 'files', { configurable: true, value: [document] });

    expect(() => {
      nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
      nativeInput.dispatchEvent(new Event('blur'));
    }).not.toThrow();

    expect(unboundFixture.componentInstance.selections).toEqual([[document]]);
    expect(nativeInput.value).toBe('');

    const changed = vi.fn();
    const touched = vi.fn();
    directive.registerOnChange(changed);
    directive.registerOnTouched(touched);
    nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
    nativeInput.dispatchEvent(new Event('blur'));

    expect(changed).toHaveBeenCalledExactlyOnceWith([document]);
    expect(touched).toHaveBeenCalledOnce();
    expect(unboundFixture.componentInstance.selections).toEqual([[document], [document]]);
  });

  it('updates the form with selected files before emitting the selection and marks it dirty', () => {
    fixture.detectChanges();
    const first = new File(['first'], 'first.csv');
    const second = new File(['second'], 'second.csv');

    selectFiles(first, second);

    expect(host.form.controls.files.value).toEqual([first, second]);
    expect(host.form.controls.files.dirty).toBe(true);
    expect(host.form.controls.files.touched).toBe(false);
    expect(host.selections).toEqual([[first, second]]);
    expect(host.valuesAtSelection).toEqual([[first, second]]);
    expect(input().value).toBe('');
  });

  it('emits only the new file value once for each accepted selection', () => {
    fixture.detectChanges();
    const first = new File(['first'], 'first.csv');
    const second = new File(['second'], 'second.csv');
    const valueChanged = vi.fn();
    host.form.controls.files.valueChanges.subscribe(valueChanged);

    selectFiles(first);

    expect(valueChanged).toHaveBeenCalledExactlyOnceWith([first]);

    selectFiles(second);

    expect(valueChanged.mock.calls).toEqual([[[first]], [[second]]]);
  });

  it('snapshots supplied file arrays instead of retaining a mutable caller array', () => {
    fixture.detectChanges();
    const first = new File(['first'], 'first.csv');
    const files = [first];

    accessor().selectFiles(files);
    files.push(new File(['second'], 'second.csv'));

    expect(host.form.controls.files.value).toEqual([first]);
    expect(host.form.controls.files.value).not.toBe(files);
    expect(host.selections).toEqual([[first]]);
  });

  it('marks the control touched after native blur', () => {
    fixture.detectChanges();

    input().dispatchEvent(new Event('blur'));

    expect(host.form.controls.files.touched).toBe(true);
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.selections).toEqual([]);
  });

  it('runs validators when selection changes', () => {
    host.form.controls.files.setValidators(Validators.required);
    host.form.controls.files.updateValueAndValidity();
    fixture.detectChanges();
    expect(host.form.controls.files.hasError('required')).toBe(true);

    selectFiles(new File(['content'], 'required.csv'));

    expect(host.form.valid).toBe(true);
  });

  it('rejects an oversized native batch before changing the form or emitting files', () => {
    const previousFiles = createFiles(1);
    host.form.controls.files.setValue(previousFiles);
    fixture.detectChanges();
    const clearNativeInput = vi.spyOn(input(), 'value', 'set');

    selectFiles(...createFiles(11));

    expect(host.form.controls.files.value).toEqual(previousFiles);
    expect(host.form.controls.files.getError('maxFiles')).toEqual({ maxFiles: 10, actualFiles: 11 });
    expect(host.form.invalid).toBe(true);
    expect(host.selections).toEqual([]);
    expect(clearNativeInput).toHaveBeenCalledWith('');
  });

  it('applies the configured limit to supplied file arrays as well as native selections', () => {
    host.maxFiles = 6;
    fixture.detectChanges();

    accessor().selectFiles(createFiles(7));

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.getError('maxFiles')).toEqual({ maxFiles: 6, actualFiles: 7 });
    expect(host.selections).toEqual([]);

    const accepted = createFiles(6);
    accessor().selectFiles(accepted);

    expect(host.form.controls.files.value).toEqual(accepted);
    expect(host.form.controls.files.hasError('maxFiles')).toBe(false);
    expect(host.selections).toEqual([accepted]);
  });

  it('retains other control validation errors while rejecting and correcting a batch', () => {
    host.form.controls.files.addValidators(() => ({ domainRule: true }));
    fixture.detectChanges();

    selectFiles(...createFiles(11));

    expect(host.form.controls.files.errors).toEqual({
      domainRule: true,
      maxFiles: { maxFiles: 10, actualFiles: 11 },
    });

    selectFiles(...createFiles(1));

    expect(host.form.controls.files.errors).toEqual({ domainRule: true });
    expect(host.selections).toHaveLength(1);
  });

  it('emits only the accepted file value when correcting a rejected batch', () => {
    host.form.controls.files.setValue(createFiles(1));
    fixture.detectChanges();
    selectFiles(...createFiles(11));
    expect(host.form.controls.files.hasError('maxFiles')).toBe(true);
    const valueChanged = vi.fn();
    host.form.controls.files.valueChanges.subscribe(valueChanged);
    const accepted = createFiles(2);

    selectFiles(...accepted);

    expect(valueChanged).toHaveBeenCalledExactlyOnceWith(accepted);
    expect(host.form.controls.files.valid).toBe(true);
  });

  it.each(['blur', 'submit'] as const)('defers a corrected selection value until its updateOn %s event', (updateOn) => {
    const previousFiles = createFiles(1);
    host.form = new FormGroup({
      files: new FormControl<readonly File[] | null>(previousFiles, { updateOn }),
    });
    fixture.detectChanges();
    selectFiles(...createFiles(11));
    expect(host.form.controls.files.hasError('maxFiles')).toBe(true);
    const valueChanged = vi.fn();
    host.form.controls.files.valueChanges.subscribe(valueChanged);
    const accepted = createFiles(2);

    selectFiles(...accepted);

    expect(valueChanged).not.toHaveBeenCalled();
    expect(host.form.controls.files.value).toEqual(previousFiles);

    input().dispatchEvent(new Event('blur'));
    if (updateOn === 'submit') {
      expect(valueChanged).not.toHaveBeenCalled();
      fixture.nativeElement
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    expect(valueChanged).toHaveBeenCalledExactlyOnceWith(accepted);
    expect(host.form.controls.files.value).toEqual(accepted);
    expect(host.form.controls.files.valid).toBe(true);
    expect(host.selections).toEqual([accepted]);
  });

  it('does not validate cumulative programmatic files against the last selection limit', () => {
    fixture.detectChanges();
    const firstBatch = createFiles(10);
    const secondBatch = createFiles(10);
    selectFiles(...firstBatch);
    selectFiles(...secondBatch);

    host.form.controls.files.setValue([...firstBatch, ...secondBatch]);

    expect(host.form.controls.files.value).toHaveLength(20);
    expect(host.form.valid).toBe(true);
    expect(host.selections).toEqual([firstBatch, secondBatch]);
  });

  it('keeps a rejected-batch error when parent-owned rows are revalidated', () => {
    fixture.detectChanges();
    selectFiles(...createFiles(11));

    host.form.controls.files.setValue(createFiles(2));
    host.form.controls.files.updateValueAndValidity();

    expect(host.form.controls.files.getError('maxFiles')).toEqual({ maxFiles: 10, actualFiles: 11 });
    expect(host.selections).toEqual([]);
  });

  it.each([null, []])('clears count validation when the control resets to %s', (value) => {
    fixture.detectChanges();
    selectFiles(...createFiles(11));
    expect(host.form.controls.files.invalid).toBe(true);

    host.form.controls.files.reset(value);

    expect(host.form.controls.files.valid).toBe(true);
    expect(host.form.controls.files.value).toEqual(value);
    expect(host.form.controls.files.untouched).toBe(true);
    expect(host.selections).toEqual([]);
  });

  it.each(['blur', 'submit'] as const)('blocks oversized batches with updateOn %s controls', (updateOn) => {
    host.form = new FormGroup({
      files: new FormControl<readonly File[] | null>(null, { updateOn }),
    });
    fixture.detectChanges();

    selectFiles(...createFiles(11));
    input().dispatchEvent(new Event('blur'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.getError('maxFiles')).toEqual({ maxFiles: 10, actualFiles: 11 });
    expect(host.selections).toEqual([]);
  });

  it('notifies validation changes and handles rejected selections without registered form callbacks', () => {
    unboundFixture = TestBed.createComponent(UnboundFileInputTestHostComponent);
    unboundFixture.detectChanges();
    const directive = unboundFixture.debugElement
      .query(By.directive(MojMultiFileUploadInputControlDirective))
      .injector.get(MojMultiFileUploadInputControlDirective);

    expect(() => directive.selectFiles(createFiles(11))).not.toThrow();
    expect(directive.validate()).toEqual({ maxFiles: { maxFiles: 10, actualFiles: 11 } });
    expect(unboundFixture.componentInstance.selections).toEqual([]);

    const validationChanged = vi.fn();
    directive.registerOnValidatorChange(validationChanged);
    directive.maxFiles = 12;

    expect(validationChanged).toHaveBeenCalled();
    expect(directive.validate()).toBeNull();
    expect(unboundFixture.componentInstance.selections).toEqual([]);

    directive.maxFiles = 1;
    directive.selectFiles(createFiles(2));
    directive.writeValue();

    expect(directive.validate()).toBeNull();
    expect(unboundFixture.componentInstance.selections).toEqual([]);
  });

  it('clears the native value for programmatic non-empty values without reporting a user selection', () => {
    fixture.detectChanges();
    const document = new File(['content'], 'programmatic.csv');
    const setValue = vi.spyOn(input(), 'value', 'set');

    expect(() => host.form.controls.files.setValue([document])).not.toThrow();

    expect(host.form.controls.files.value).toEqual([document]);
    expect(input().value).toBe('');
    expect(setValue).toHaveBeenCalledWith('');
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.selections).toEqual([]);
  });

  it('resets the native input and control state without emitting another selection', () => {
    fixture.detectChanges();
    selectFiles(new File(['content'], 'reset.csv'));
    input().dispatchEvent(new Event('blur'));

    host.form.reset();

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.form.controls.files.untouched).toBe(true);
    expect(input().value).toBe('');
    expect(host.selections).toHaveLength(1);
  });

  it('ignores cancelled native selections and empty supplied arrays', () => {
    fixture.detectChanges();
    Object.defineProperty(input(), 'files', { configurable: true, value: null });

    input().dispatchEvent(new Event('change', { bubbles: true }));
    accessor().selectFiles([]);

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.selections).toEqual([]);
  });

  it('ignores native and supplied selections and blur while disabled, then supports re-enabling', () => {
    host.form.controls.files.disable();
    fixture.detectChanges();
    const document = new File(['content'], 'disabled.csv');

    selectFiles(document);
    accessor().selectFiles([document]);
    input().dispatchEvent(new Event('blur'));

    expect(input().disabled).toBe(true);
    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.form.controls.files.untouched).toBe(true);
    expect(host.selections).toEqual([]);

    host.form.controls.files.enable();
    selectFiles(document);

    expect(input().disabled).toBe(false);
    expect(host.form.controls.files.value).toEqual([document]);
    expect(host.selections).toEqual([[document]]);
  });

  it('commits pending file selection on blur when the control uses updateOn blur', () => {
    host.form = new FormGroup({
      files: new FormControl<readonly File[] | null>(null, { updateOn: 'blur' }),
    });
    fixture.detectChanges();
    const document = new File(['content'], 'blur.csv');
    const valueChanged = vi.fn();
    host.form.controls.files.valueChanges.subscribe(valueChanged);

    selectFiles(document);

    expect(valueChanged).not.toHaveBeenCalled();
    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.selections).toEqual([[document]]);

    input().dispatchEvent(new Event('blur'));

    expect(valueChanged).toHaveBeenCalledExactlyOnceWith([document]);
    expect(host.form.controls.files.value).toEqual([document]);
    expect(host.form.controls.files.dirty).toBe(true);
    expect(host.form.controls.files.touched).toBe(true);
  });

  it('commits pending file selection on form submission when the control uses updateOn submit', () => {
    host.form = new FormGroup({
      files: new FormControl<readonly File[] | null>(null, { updateOn: 'submit' }),
    });
    fixture.detectChanges();
    const document = new File(['content'], 'submit.csv');
    const valueChanged = vi.fn();
    host.form.controls.files.valueChanges.subscribe(valueChanged);

    selectFiles(document);
    input().dispatchEvent(new Event('blur'));

    expect(valueChanged).not.toHaveBeenCalled();
    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.form.controls.files.untouched).toBe(true);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(valueChanged).toHaveBeenCalledExactlyOnceWith([document]);
    expect(host.form.controls.files.value).toEqual([document]);
    expect(host.form.controls.files.dirty).toBe(true);
    expect(host.form.controls.files.touched).toBe(true);
    expect(host.selections).toEqual([[document]]);
  });
});

describe('MojMultiFileUploadInputControlDirective provider metadata', () => {
  it('retains its value accessor when test providers are added through Angular metadata overrides', async () => {
    const additionalProvider = new InjectionToken<string>('file-input-test-provider');
    await TestBed.configureTestingModule({ imports: [UnboundFileInputTestHostComponent] })
      .overrideDirective(MojMultiFileUploadInputControlDirective, {
        add: { providers: [{ provide: additionalProvider, useValue: 'available' }] },
      })
      .compileComponents();
    const fixture = TestBed.createComponent(UnboundFileInputTestHostComponent);
    try {
      fixture.detectChanges();
      const directiveElement = fixture.debugElement.query(By.directive(MojMultiFileUploadInputControlDirective));
      const directive = directiveElement.injector.get(MojMultiFileUploadInputControlDirective);
      const document = new File(['content'], 'provided.csv');
      const changed = vi.fn();
      directive.registerOnChange(changed);

      directive.selectFiles([document]);

      expect(directiveElement.injector.get(additionalProvider)).toBe('available');
      expect(directiveElement.injector.get(NG_VALUE_ACCESSOR)).toContain(directive);
      expect(directiveElement.injector.get(NG_VALIDATORS)).toContain(directive);
      expect(changed).toHaveBeenCalledExactlyOnceWith([document]);
      expect(fixture.componentInstance.selections).toEqual([[document]]);
    } finally {
      fixture.destroy();
    }
  });
});
