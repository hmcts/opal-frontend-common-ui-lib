import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MojMultiFileUploadInputComponent } from './moj-multi-file-upload-input.component';

@Component({
  selector: 'opal-lib-upload-input-test-host',
  imports: [MojMultiFileUploadInputComponent],
  template: `
    <opal-lib-moj-multi-file-upload-input
      inputId="supporting-documents"
      inputName="documents"
      labelText="Supporting documents"
      [control]="control"
    />
  `,
})
class UploadInputTestHostComponent {
  public readonly control = new FormControl<readonly File[] | null>(null);
}

describe('MojMultiFileUploadInputComponent', () => {
  let fixture: ComponentFixture<MojMultiFileUploadInputComponent>;
  let hostFixture: ComponentFixture<UploadInputTestHostComponent> | undefined;
  let component: MojMultiFileUploadInputComponent;
  let control: FormControl<readonly File[] | null>;
  let selections: (readonly File[])[];

  const input = (): HTMLInputElement => fixture.nativeElement.querySelector('input[type="file"]');
  const pickerLabel = (): HTMLLabelElement => fixture.nativeElement.querySelector('label.govuk-button');
  const uploadButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button.moj-multi-file-upload__button');
  const dropzone = (): HTMLElement => fixture.nativeElement.querySelector('.moj-multi-file-upload__dropzone');
  const selectFiles = (...files: File[]): void => {
    Object.defineProperty(input(), 'files', { configurable: true, value: files });
    input().dispatchEvent(new Event('change', { bubbles: true }));
  };
  const dropFiles = (...files: File[]): Event => {
    const event = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { files } });
    dropzone().dispatchEvent(event);
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiFileUploadInputComponent, UploadInputTestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MojMultiFileUploadInputComponent);
    component = fixture.componentInstance;
    component.inputId = 'supporting-documents';
    component.inputName = 'files';
    component.labelText = 'Add files';
    control = new FormControl<readonly File[] | null>(null);
    component.control = control;
    selections = [];
    component.filesSelected.subscribe((files) => selections.push(files));
  });

  afterEach(() => {
    fixture.destroy();
    fixture.nativeElement.remove();
    hostFixture?.destroy();
    hostFixture?.nativeElement.remove();
    hostFixture = undefined;
  });

  it('renders consumer labels, hints, button text and native file attributes', () => {
    component.inputName = 'documents';
    component.labelText = 'Upload supporting documents';
    component.hintText = 'Choose documents for this application';
    component.dropzoneHintText = 'Drop your documents here or';
    component.buttonText = 'Select documents';
    component.uploadButtonText = 'Send documents';
    component.acceptedTypes = ['.csv', 'application/pdf'];

    fixture.detectChanges();

    expect(input().id).toBe('supporting-documents');
    expect(input().name).toBe('documents');
    expect(input().accept).toBe('.csv,application/pdf');
    expect(input().multiple).toBe(true);
    expect(fixture.nativeElement.querySelector('label').textContent).toContain('Upload supporting documents');
    expect(fixture.nativeElement.textContent).toContain('Choose documents for this application');
    expect(dropzone().textContent).toContain('Drop your documents here or');
    expect(pickerLabel().textContent).toContain('Select documents');
    expect(uploadButton().textContent).toContain('Send documents');
    expect(uploadButton().type).toBe('submit');
    expect(uploadButton().getAttribute('data-module')).toBe('govuk-button');
    const formGroup: HTMLElement = fixture.nativeElement.querySelector('.govuk-form-group');
    expect(uploadButton().previousElementSibling).toBe(formGroup);
    expect(uploadButton().parentElement?.classList.contains('moj-multi-file-upload__upload')).toBe(true);
    expect(formGroup.querySelector('label.govuk-label--m')?.getAttribute('for')).toBe(input().id);
  });

  it('uses the native label to activate the file input and keeps the input keyboard accessible', () => {
    fixture.detectChanges();
    const activateInput = vi.fn();
    input().addEventListener('click', activateInput);

    pickerLabel().click();

    expect(pickerLabel().control).toBe(input());
    expect(input().tabIndex).toBeGreaterThanOrEqual(0);
    expect(input().disabled).toBe(false);
    expect(activateInput).toHaveBeenCalledOnce();
    expect(uploadButton().textContent?.trim()).toBe('Upload file');
  });

  it('applies consumer label and input classes alongside the native upload classes', () => {
    component.labelClasses = 'govuk-label--l';
    component.inputClasses = 'application-file-input';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label.govuk-label--l')).not.toBeNull();
    expect(input().classList.contains('application-file-input')).toBe(true);
    expect(input().classList.contains('govuk-file-upload')).toBe(true);
    expect(input().classList.contains('moj-multi-file-upload__input')).toBe(true);
  });

  it('associates both labels with a unique native input through the consumer form-control API', () => {
    const host = TestBed.createComponent(UploadInputTestHostComponent);
    hostFixture = host;
    host.detectChanges();
    const nativeInput: HTMLInputElement = host.nativeElement.querySelector('input[type="file"]');
    const labels: HTMLLabelElement[] = Array.from(host.nativeElement.querySelectorAll('label'));
    const activateInput = vi.fn();
    nativeInput.addEventListener('click', activateInput);

    expect(host.nativeElement.querySelectorAll('[id="supporting-documents"]')).toHaveLength(1);
    expect(document.getElementById('supporting-documents')).toBe(nativeInput);
    for (const label of labels) {
      expect(label.control).toBe(nativeInput);
      label.click();
    }
    expect(activateInput).toHaveBeenCalledTimes(2);
    expect(host.componentInstance.control.value).toBeNull();
  });

  it('focuses the native file input and shows the standard MoJ label focus styling', () => {
    fixture.detectChanges();

    component.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input());
    expect(pickerLabel().classList.contains('moj-multi-file-upload--focused')).toBe(true);

    input().blur();
    fixture.detectChanges();

    expect(pickerLabel().classList.contains('moj-multi-file-upload--focused')).toBe(false);
    expect(control.touched).toBe(true);
  });

  it('emits selected files in order without modifying them', () => {
    const first = new File(['first'], 'first.csv', { type: 'text/csv' });
    const second = new File(['second'], 'second.pdf', { type: 'application/pdf' });
    const valuesAtSelection: (readonly File[] | null)[] = [];
    component.filesSelected.subscribe(() => valuesAtSelection.push(control.value));
    fixture.detectChanges();

    selectFiles(first, second);

    expect(selections).toEqual([[first, second]]);
    expect(selections[0][0]).toBe(first);
    expect(selections[0][1]).toBe(second);
    expect(control.value).toEqual([first, second]);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(false);
    expect(valuesAtSelection).toEqual([[first, second]]);
  });

  it('runs control validators and resets without emitting another selection', () => {
    control.setValidators(Validators.required);
    control.updateValueAndValidity();
    fixture.detectChanges();
    expect(control.hasError('required')).toBe(true);

    selectFiles(new File(['content'], 'required.csv'));
    expect(control.valid).toBe(true);

    control.reset();

    expect(control.value).toBeNull();
    expect(control.hasError('required')).toBe(true);
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    expect(input().value).toBe('');
    expect(selections).toHaveLength(1);
  });

  it('accepts programmatic file values without writing filenames to the native input or emitting selection', () => {
    fixture.detectChanges();
    const files = [new File(['content'], 'programmatic.csv')];
    const setValue = vi.spyOn(input(), 'value', 'set');

    expect(() => control.setValue(files)).not.toThrow();

    expect(control.value).toEqual(files);
    expect(input().value).toBe('');
    expect(setValue).toHaveBeenCalledWith('');
    expect(selections).toEqual([]);
  });

  it('resets the native input so the same file can be selected again', () => {
    const document = new File(['content'], 'repeat.csv');
    fixture.detectChanges();
    const setValue = vi.spyOn(input(), 'value', 'set');

    selectFiles(document);
    selectFiles(document);

    expect(setValue).toHaveBeenCalledWith('');
    expect(selections).toEqual([[document], [document]]);
  });

  it('does not emit a selection when the picker is cancelled or the drop contains no files', () => {
    fixture.detectChanges();
    Object.defineProperty(input(), 'files', { configurable: true, value: null });

    input().dispatchEvent(new Event('change', { bubbles: true }));
    dropFiles();
    dropzone().dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));

    expect(selections).toEqual([]);
    expect(input().value).toBe('');
  });

  it('emits dropped files and prevents the browser from opening them', () => {
    const document = new File(['content'], 'dropped.csv');
    fixture.detectChanges();

    const event = dropFiles(document);

    expect(event.defaultPrevented).toBe(true);
    expect(selections).toEqual([[document]]);
    expect(control.value).toEqual([document]);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('commits dropped files and marks the control touched when configured to update on blur', () => {
    control = new FormControl<readonly File[] | null>(null, { updateOn: 'blur' });
    component.control = control;
    const document = new File(['content'], 'dropped.csv');
    fixture.detectChanges();

    dropFiles(document);

    expect(control.value).toEqual([document]);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(selections).toEqual([[document]]);
  });

  it('leaves file types, filenames, file sizes and dropped file counts to the consumer', () => {
    component.acceptedTypes = ['.csv'];
    component.multiple = false;
    const unsupported = new File(['content'], 'invalid.name.pdf', { type: 'application/pdf' });
    const large = new File([new Uint8Array(6 * 1024 * 1024)], 'large.csv', { type: 'text/csv' });
    fixture.detectChanges();

    dropFiles(unsupported, large);

    expect(input().multiple).toBe(false);
    expect(input().accept).toBe('.csv');
    expect(selections).toEqual([[unsupported, large]]);
    expect(component.errors).toEqual([]);
    expect(fixture.nativeElement.querySelector('.govuk-error-message')).toBeNull();
  });

  it('emits picker files unchanged even when their types do not match accept', () => {
    component.acceptedTypes = ['.csv'];
    const unsupported = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fixture.detectChanges();

    selectFiles(unsupported);

    expect(selections).toEqual([[unsupported]]);
  });

  it('disables the native controls and ignores picker and drop events when disabled', () => {
    component.getControl.disable();
    fixture.detectChanges();
    const activateInput = vi.fn();
    input().addEventListener('click', activateInput);

    pickerLabel().click();
    selectFiles(new File(['content'], 'picker.csv'));
    const event = dropFiles(new File(['content'], 'drop.csv'));

    expect(input().disabled).toBe(true);
    expect(uploadButton().disabled).toBe(true);
    expect(pickerLabel().getAttribute('aria-disabled')).toBe('true');
    expect(pickerLabel().classList.contains('govuk-button--disabled')).toBe(true);
    expect(activateInput).not.toHaveBeenCalled();
    expect(selections).toEqual([]);
    expect(event.defaultPrevented).toBe(true);
    expect(control.value).toBeNull();
    expect(control.pristine).toBe(true);
  });

  it('shows drag feedback only while enabled and clears it after leaving or dropping', () => {
    fixture.detectChanges();
    const over = new Event('dragover', { bubbles: true, cancelable: true });
    dropzone().dispatchEvent(over);
    fixture.detectChanges();
    expect(over.defaultPrevented).toBe(true);
    expect(dropzone().classList.contains('moj-multi-file-upload--dragover')).toBe(true);

    const leave = new Event('dragleave', { bubbles: true, cancelable: true });
    dropzone().dispatchEvent(leave);
    fixture.detectChanges();
    expect(leave.defaultPrevented).toBe(true);
    expect(dropzone().classList.contains('moj-multi-file-upload--dragover')).toBe(false);

    dropzone().dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    dropFiles(new File(['content'], 'drop.csv'));
    fixture.detectChanges();
    expect(dropzone().classList.contains('moj-multi-file-upload--dragover')).toBe(false);
  });

  it('enables selection again through the supplied control', () => {
    component.getControl.disable();
    fixture.detectChanges();
    const document = new File(['content'], 'enabled.csv');

    component.getControl.enable();
    fixture.detectChanges();
    selectFiles(document);

    expect(input().disabled).toBe(false);
    expect(uploadButton().disabled).toBe(false);
    expect(pickerLabel().getAttribute('aria-disabled')).toBe('false');
    expect(control.value).toEqual([document]);
    expect(selections).toEqual([[document]]);
  });

  it('does not show active drag feedback when disabled', () => {
    component.getControl.disable();
    fixture.detectChanges();

    dropzone().dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(dropzone().classList.contains('moj-multi-file-upload--dragover')).toBe(false);
  });

  it('associates labels, hints and every supplied error with the native file input', () => {
    component.hintText = 'Choose up to five documents';
    component.errors = ['first.csv: The filename is invalid', 'second.csv: The file is too large'];
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label.govuk-label');
    const describedBy = input().getAttribute('aria-describedby')!.split(/\s+/);
    const descriptionText = describedBy
      .map((id) => fixture.nativeElement.querySelector(`[id="${id}"]`)?.textContent ?? '')
      .join(' ');

    expect(label.htmlFor).toBe(input().id);
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(pickerLabel().control).toBe(input());
    expect(descriptionText).toContain('Choose up to five documents');
    expect(descriptionText).toContain(component.dropzoneHintText);
    expect(descriptionText).toContain('first.csv: The filename is invalid');
    expect(descriptionText).toContain('second.csv: The file is too large');
    expect(describedBy).toContain('supporting-documents-error');
    input().focus();
    expect(document.activeElement).toBe(input());
  });

  it('describes only the dropzone when there is no optional hint or error', () => {
    fixture.detectChanges();

    expect(component.hintText).toBeNull();
    expect(input().getAttribute('aria-describedby')).toBe('supporting-documents-dropzone-hint');
    expect(input().getAttribute('aria-invalid')).not.toBe('true');
    expect(fixture.nativeElement.querySelector('.govuk-error-message')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-hint')).toBeNull();
  });

  it.each([null, ''])('omits the optional hint and its aria reference when hintText is %s', (hintText) => {
    component.hintText = hintText;
    component.errors = ['The selected file is invalid'];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#supporting-documents-hint')).toBeNull();
    expect(input().getAttribute('aria-describedby')).toBe(
      'supporting-documents-dropzone-hint supporting-documents-error',
    );
    expect(input().getAttribute('aria-invalid')).toBe('true');
  });
});
