import { Component, type Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAbstractFormBaseFieldErrors } from '../abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { MojMultiFileUploadInputComponent } from '../../moj/moj-multi-file-upload/moj-multi-file-upload-input/moj-multi-file-upload-input.component';
import { AbstractMultiFileUploadComponent } from './abstract-multi-file-upload.component';
import type { IAbstractMultiFileUploadItem } from './interfaces/abstract-multi-file-upload-item.interface';

const fieldErrors = {
  required: { message: 'Select a file', priority: 1 },
  fileUpload: { message: 'Check files with errors', priority: 2 },
  uploadPending: { message: 'Wait for uploads', priority: 3 },
};

@Component({ selector: 'opal-lib-upload-base-test-host', template: '' })
class UploadBaseTestHostComponent extends AbstractMultiFileUploadComponent {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    files: fieldErrors,
    notes: { required: { message: 'Enter a note', priority: 1 } },
  };
  public override form = new FormGroup({
    files: new FormControl<readonly File[]>([], {
      nonNullable: true,
      validators: [Validators.required, this.fileUploadValidator],
    }),
    notes: new FormControl('', { nonNullable: true }),
  });
}

@Component({
  selector: 'opal-lib-named-upload-base-test-host',
  imports: [MojMultiFileUploadInputComponent],
  template: `
    <opal-lib-moj-multi-file-upload-input
      [control]="form.controls.documents"
      inputId="documents"
      inputName="documents"
      labelText="Upload documents"
      (filesSelected)="onFilesSelected($event)"
    />
  `,
})
class NamedUploadBaseTestHostComponent extends AbstractMultiFileUploadComponent {
  protected override uploadControlName = 'documents';
  protected override fieldErrors = { documents: fieldErrors };
  public override form = new FormGroup({
    documents: new FormControl<readonly File[]>([], {
      nonNullable: true,
      validators: [this.fileUploadValidator],
    }),
  });
}

@Component({ selector: 'opal-lib-nullable-upload-base-test-host', template: '' })
class NullableUploadBaseTestHostComponent extends AbstractMultiFileUploadComponent {
  protected override fieldErrors = { files: fieldErrors };
  public override form = new FormGroup({
    files: new FormControl<readonly File[] | null>(null, { validators: [this.fileUploadValidator] }),
  });
}

describe('AbstractMultiFileUploadComponent', () => {
  let fixture: ComponentFixture<UploadBaseTestHostComponent>;
  let component: UploadBaseTestHostComponent;
  let namedFixture: ComponentFixture<NamedUploadBaseTestHostComponent> | undefined;
  let nullableFixture: ComponentFixture<NullableUploadBaseTestHostComponent> | undefined;

  const file = (name: string): File => new File(['content'], name);
  const item = (document: File, update: Partial<IAbstractMultiFileUploadItem> = {}): IAbstractMultiFileUploadItem => ({
    id: document.name,
    name: document.name,
    file: document,
    status: 'success',
    progress: 100,
    errors: [],
    ...update,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBaseTestHostComponent, NamedUploadBaseTestHostComponent, NullableUploadBaseTestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(UploadBaseTestHostComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    namedFixture?.destroy();
    namedFixture = undefined;
    nullableFixture?.destroy();
    nullableFixture = undefined;
    vi.restoreAllMocks();
  });

  it('starts with the consumer-owned required control and no displayed errors', () => {
    component.files = [];
    fixture.detectChanges();

    expect(component.fileUploads()).toEqual([]);
    expect(component.announcement).toBe('');
    expect(component.fileErrors()).toEqual([]);
    expect(component.fileInputErrors).toEqual([]);
    expect(component.form.controls.files.hasError('required')).toBe(true);
    expect(component.form.controls.files.pristine).toBe(true);
  });

  it('synchronises parent-supplied rows to the cumulative raw file model without changing them', () => {
    const first = file('first.csv');
    const second = file('second.csv');
    const rows = Object.freeze([Object.freeze(item(first)), Object.freeze(item(second))]);
    component.files = rows;
    fixture.detectChanges();

    expect(component.fileUploads()).toBe(rows);
    expect(component.form.controls.files.value).toEqual([first, second]);
    expect(component.form.controls.files.dirty).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it.each(['pending', 'uploading', 'rejected', 'failed'] as const)(
    'keeps a supplied %s row invalid until the parent supplies success',
    (status) => {
      const document = file('pending.csv');
      component.files = [item(document, { status, progress: 100 })];

      expect(component.form.controls.files.errors).toEqual({ uploadPending: true });

      component.files = [item(document)];

      expect(component.form.valid).toBe(true);
    },
  );

  it('aggregates every supplied row error and prefixes display errors with its filename', () => {
    const document = file('repeated.csv');
    component.files = [
      item(document, { id: 'first' }),
      item(document, { id: 'second', status: 'failed', errors: ['Server rejected the file'] }),
      item(file('invalid.csv'), { status: 'rejected', errors: ['Invalid filename', 'File is too large'] }),
    ];

    expect(component.form.controls.files.value).toEqual([document, document, component.fileUploads()[2].file]);
    expect(component.form.controls.files.errors).toEqual({
      fileUpload: ['Server rejected the file', 'Invalid filename', 'File is too large'],
    });
    expect(component.fileErrors()).toEqual([
      'repeated.csv: Server rejected the file',
      'invalid.csv: Invalid filename',
      'invalid.csv: File is too large',
    ]);
    expect(component.fileInputErrors).toEqual(component.fileErrors());
  });

  it('uses inherited generic file summaries while preserving other field errors and parent updates', () => {
    const stored = item(file('stored.csv'));
    const rejected = item(file('rejected.csv'), {
      status: 'rejected',
      errors: ['Invalid filename', 'File is too large'],
    });
    const failed = item(file('failed.csv'), { status: 'failed', errors: ['The upload was rejected'] });
    const pending = item(file('pending.csv'), { status: 'uploading', progress: 100 });
    component.form.controls.notes.setValidators(Validators.required);
    component.form.controls.notes.updateValueAndValidity();
    component.files = [stored, rejected, failed, pending];
    fixture.detectChanges();

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(component.formErrorSummaryMessage).toEqual([
      { fieldId: 'files', message: 'Check files with errors' },
      { fieldId: 'notes', message: 'Enter a note' },
    ]);
    expect(component.formErrorSummaryMessage).toContainEqual({ fieldId: 'notes', message: 'Enter a note' });
    expect(component.formErrorSummaryMessage).toHaveLength(2);
    expect(component.fileInputErrors).toEqual(component.fileErrors());

    component.files = [stored, item(rejected.file), failed, pending];

    expect(component.formErrorSummaryMessage.filter((error) => error.fieldId === 'files')).toEqual([
      { fieldId: 'files', message: 'Check files with errors' },
    ]);
    expect(component.formErrorSummaryMessage).toContainEqual({ fieldId: 'notes', message: 'Enter a note' });

    component.files = [stored, item(rejected.file), item(failed.file), pending];

    expect(component.formErrorSummaryMessage.filter((error) => error.fieldId === 'files')).toEqual([
      { fieldId: 'files', message: 'Wait for uploads' },
    ]);

    component.files = [stored, item(rejected.file), item(failed.file), item(pending.file)];

    expect(component.formErrorSummaryMessage).toEqual([{ fieldId: 'notes', message: 'Enter a note' }]);
    expect(component.fileInputErrors).toEqual([]);
  });

  it('uses the configured upload control name for inherited generic summaries', () => {
    namedFixture = TestBed.createComponent(NamedUploadBaseTestHostComponent);
    const named = namedFixture.componentInstance;
    named.files = [item(file('document.csv'), { status: 'failed', errors: ['The document was rejected'] })];
    namedFixture.detectChanges();

    named.handleFormSubmit(new SubmitEvent('submit'));

    expect(named.formErrorSummaryMessage).toEqual([{ fieldId: 'documents', message: 'Check files with errors' }]);
    expect(named.fileInputErrors).toEqual(['document.csv: The document was rejected']);
  });

  it('omits a disabled upload control from the summary while retaining enabled field errors', () => {
    component.files = [item(file('failed.csv'), { status: 'failed', errors: ['Upload unavailable'] })];
    component.form.controls.files.disable();
    component.form.controls.notes.setValidators(Validators.required);
    component.form.controls.notes.updateValueAndValidity();
    fixture.detectChanges();

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(component.formErrorSummaryMessage).toEqual([{ fieldId: 'notes', message: 'Enter a note' }]);
    expect(component.form.controls.notes.enabled).toBe(true);

    component.form.controls.files.enable();
    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: 'files',
      message: 'Check files with errors',
    });
    expect(component.formErrorSummaryMessage).toContainEqual({ fieldId: 'notes', message: 'Enter a note' });
  });

  it('emits raw selection intent without validating, appending or changing supplied rows', () => {
    const retained = item(file('retained.csv'));
    const selected = Object.freeze([file('unsupported.mov'), file('unsupported.mov')]);
    const onSelect = vi.fn();
    component.files = [retained];
    component.filesSelected.subscribe(onSelect);

    component.onFilesSelected(selected);

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(selected);
    expect(component.fileUploads()).toEqual([retained]);
    expect(component.form.controls.files.value).toEqual([retained.file]);
  });

  it('ignores an empty selection', () => {
    const selected = vi.fn();
    component.filesSelected.subscribe(selected);

    component.onFilesSelected([]);

    expect(selected).not.toHaveBeenCalled();
  });

  it('guards file selection when the upload control is disabled while other form fields remain enabled', () => {
    const retained = item(file('retained.csv'));
    const selected = vi.fn();
    const nextSelection = [file('selected.csv')];
    component.files = [retained];
    component.filesSelected.subscribe(selected);
    component.form.controls.files.disable();

    component.onFilesSelected(nextSelection);

    expect(component.form.enabled).toBe(true);
    expect(component.form.controls.notes.enabled).toBe(true);
    expect(selected).not.toHaveBeenCalled();
    expect(component.fileUploads()).toEqual([retained]);

    component.form.controls.files.enable();
    component.onFilesSelected(nextSelection);
    expect(selected).toHaveBeenCalledExactlyOnceWith(nextSelection);
  });

  it('treats a different file instance or reordered model as pending', () => {
    const first = file('first.csv');
    const second = file('second.csv');
    component.files = [item(first), item(second)];
    expect(component.form.valid).toBe(true);

    component.form.controls.files.setValue([second, first]);
    expect(component.form.controls.files.hasError('uploadPending')).toBe(true);

    component.form.controls.files.setValue([file('first.csv'), second]);
    expect(component.form.controls.files.hasError('uploadPending')).toBe(true);

    component.files = [item(first), item(second)];
    expect(component.form.valid).toBe(true);
  });

  it('does not reset a submitted form or emit dirty edits for progress-only row updates', () => {
    const document = file('stored.csv');
    component.files = [item(document)];
    fixture.detectChanges();
    component.handleFormSubmit(new SubmitEvent('submit'));
    const unsaved = vi.fn();
    component['unsavedChanges'].subscribe(unsaved);

    component.files = [item(document, { progress: 95 })];

    expect(component['formSubmitted']).toBe(true);
    expect(unsaved).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('marks an added parent-owned file as a new edit after submission', () => {
    const first = item(file('first.csv'));
    const second = item(file('second.csv'));
    component.files = [first];
    fixture.detectChanges();
    component.handleFormSubmit(new SubmitEvent('submit'));
    const unsaved = vi.fn();
    component['unsavedChanges'].subscribe(unsaved);

    component.files = [first, second];

    expect(component['formSubmitted']).toBe(false);
    expect(unsaved).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('reports the first optional file selection as unsaved after submitting an empty form', () => {
    namedFixture = TestBed.createComponent(NamedUploadBaseTestHostComponent);
    const named = namedFixture.componentInstance;
    named.files = [];
    namedFixture.detectChanges();
    named.handleFormSubmit(new SubmitEvent('submit'));
    expect(named['formSubmitted']).toBe(true);

    const unsaved = vi.fn();
    named['unsavedChanges'].subscribe(unsaved);
    named.filesSelected.subscribe((files) => {
      // The native value accessor has already written this batch before parent rows arrive.
      expect(named.form.controls.documents.value).toEqual(files);
      named.files = files.map((document) => item(document, { status: 'uploading', progress: null }));
    });

    const document = file('optional.csv');
    const input = namedFixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { configurable: true, value: [document] });
    input.dispatchEvent(new Event('change'));
    namedFixture.detectChanges();

    expect(named.form.controls.documents.dirty).toBe(true);
    expect(named.form.controls.documents.value).toEqual([document]);
    expect(named.form.controls.documents.hasError('uploadPending')).toBe(true);
    expect(named['formSubmitted']).toBe(false);
    expect(unsaved).toHaveBeenLastCalledWith(true);
  });

  it('refreshes an existing summary when the parent replaces a pending row with success', () => {
    const document = file('pending.csv');
    component.files = [item(document, { status: 'uploading', progress: 100 })];
    fixture.detectChanges();
    component.handleFormSubmit(new SubmitEvent('submit'));
    expect(component.formErrorSummaryMessage).toEqual([{ fieldId: 'files', message: 'Wait for uploads' }]);
    expect(component.fileInputErrors).toEqual(['Wait for uploads']);

    component.files = [item(document)];

    expect(component.form.valid).toBe(true);
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.fileInputErrors).toEqual([]);
  });

  it('clears the form and summary, emits the clear intent and accepts replacement parent state', () => {
    const document = file('failed.csv');
    component.files = [item(document, { status: 'failed', errors: ['Upload unavailable'] })];
    fixture.detectChanges();
    component.handleFormSubmit(new SubmitEvent('submit'));
    const cleared = vi.fn(() => {
      component.files = [];
    });
    component.filesCleared.subscribe(cleared);

    component.handleClearForm();

    expect(cleared).toHaveBeenCalledOnce();
    expect(component.fileUploads()).toEqual([]);
    expect(component.form.controls.files.value).toEqual([]);
    expect(component.form.controls.files.hasError('required')).toBe(true);
    expect(component.form.pristine).toBe(true);
    expect(component['formSubmitted']).toBe(false);
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.fileInputErrors).toEqual([]);

    component.files = [item(file('replacement.csv'))];
    expect(component.form.valid).toBe(true);
  });

  it('accepts a parent-owned announcement without deriving upload status text', () => {
    component.files = [item(file('announced.csv'))];
    component.announcement = 'The application confirmed the upload';
    fixture.detectChanges();

    expect(component.announcement).toBe('The application confirmed the upload');
  });

  it('supports an optional upload field with a different control name', () => {
    namedFixture = TestBed.createComponent(NamedUploadBaseTestHostComponent);
    const named = namedFixture.componentInstance;
    named.files = [];
    namedFixture.detectChanges();
    expect(named.form.valid).toBe(true);

    const document = file('optional.csv');
    named.files = [item(document, { status: 'uploading' })];
    named.form.controls.documents.reset();

    expect(named.form.controls.documents.value).toEqual([]);
    expect(named.form.controls.documents.hasError('uploadPending')).toBe(true);
    const submit = vi.fn();
    named['formSubmit'].subscribe(submit);
    named.handleFormSubmit(new SubmitEvent('submit'));
    expect(submit).not.toHaveBeenCalled();
    expect(named.formErrorSummaryMessage).toEqual([{ fieldId: 'documents', message: 'Wait for uploads' }]);

    named.files = [item(document)];
    expect(named.form.controls.documents.value).toEqual([document]);
    expect(named.form.valid).toBe(true);
  });

  it('supports nullable file controls and restores their selected files after a reset', () => {
    nullableFixture = TestBed.createComponent(NullableUploadBaseTestHostComponent);
    const nullable = nullableFixture.componentInstance;
    nullable.files = [];
    nullableFixture.detectChanges();

    expect(nullable.form.controls.files.value).toBeNull();
    expect(nullable.form.valid).toBe(true);

    const document = file('nullable.csv');
    nullable.files = [item(document)];
    expect(nullable.form.controls.files.value).toEqual([document]);
    expect(nullable.form.valid).toBe(true);

    nullable.form.controls.files.reset();
    expect(nullable.form.controls.files.value).toBeNull();
    expect(nullable.form.controls.files.hasError('uploadPending')).toBe(true);

    nullable.files = [item(document)];
    expect(nullable.form.controls.files.value).toEqual([document]);
    expect(nullable.form.valid).toBe(true);
  });
});

describe('AbstractMultiFileUploadComponent Angular metadata', () => {
  it('initialises a caller-configured upload form through the default component factory', async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractMultiFileUploadComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    // Subclass fixtures exercise the inherited factory target; this checks the base metadata directly.
    const fixture = TestBed.createComponent(
      AbstractMultiFileUploadComponent as unknown as Type<AbstractMultiFileUploadComponent>,
    );
    try {
      const component = fixture.componentInstance;
      const control = new FormControl<readonly File[]>([], {
        nonNullable: true,
        validators: [Validators.required, component['fileUploadValidator']],
      });
      component.form = new FormGroup({ files: control });
      component['fieldErrors'] = { files: fieldErrors };
      fixture.componentRef.setInput('files', []);
      fixture.detectChanges();

      expect(component.fileUploads()).toEqual([]);
      expect(component.fileInputErrors).toEqual([]);
      expect(control.hasError('required')).toBe(true);

      component.handleFormSubmit(new SubmitEvent('submit'));

      expect(component.formErrorSummaryMessage).toEqual([{ fieldId: 'files', message: 'Select a file' }]);
      expect(component.fileInputErrors).toEqual(['Select a file']);
    } finally {
      fixture.destroy();
    }
  });
});
