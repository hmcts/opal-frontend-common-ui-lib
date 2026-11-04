import { Component, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
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
        (filesSelected)="onFilesSelected($event)"
      />
    </form>
  `,
})
class FileInputControlTestHostComponent {
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

    selectFiles(document);

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.selections).toEqual([[document]]);

    input().dispatchEvent(new Event('blur'));

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

    selectFiles(document);
    input().dispatchEvent(new Event('blur'));

    expect(host.form.controls.files.value).toBeNull();
    expect(host.form.controls.files.pristine).toBe(true);
    expect(host.form.controls.files.untouched).toBe(true);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

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
      expect(changed).toHaveBeenCalledExactlyOnceWith([document]);
      expect(fixture.componentInstance.selections).toEqual([[document]]);
    } finally {
      fixture.destroy();
    }
  });
});
