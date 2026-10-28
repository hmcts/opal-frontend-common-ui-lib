import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import type { IAbstractMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload/interfaces';

/** Adapts parent-owned upload rows to a form and emits file interaction events. */
@Component({ template: '' })
export abstract class AbstractMultiFileUploadComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly uploadItems = signal<readonly IAbstractMultiFileUploadItem[]>([]);

  protected uploadControlName = 'files';

  /** Receives replacement rows from the parent and updates the cumulative file control. */
  @Input({ required: true }) public set files(items: readonly IAbstractMultiFileUploadItem[]) {
    const previousItems = this.uploadItems();
    // The value accessor may already have written the new selection into the control.
    if (items.length !== previousItems.length || items.some((item, index) => item.file !== previousItems[index].file)) {
      this.formSubmitted = false;
    }
    this.uploadItems.set(items);
    this.syncFilesControl();
  }
  @Input() public announcement = '';

  @Output() public filesSelected = new EventEmitter<readonly File[]>();
  @Output() public filesCleared = new EventEmitter<void>();

  public readonly fileUploads = this.uploadItems.asReadonly();
  public readonly fileErrors = computed(() =>
    this.fileUploads().flatMap((item) => item.errors.map((error) => `${item.name}: ${error}`)),
  );

  /** Resolves the consuming form's file control using its configured name. */
  private get uploadControl(): FormControl<readonly File[]> {
    return this.form.get(this.uploadControlName) as FormControl<readonly File[]>;
  }

  /**
   * Reflects parent-supplied row errors and confirmed upload statuses in form validity.
   * The consumer supplies file validation rules and any required-field validator.
   * @returns Row errors, an upload-pending error for incomplete/mismatched state, or null.
   */
  private validateFilesControl(control: AbstractControl<readonly File[] | null>): ValidationErrors | null {
    const files = control.value ?? [];
    const items = this.fileUploads();
    const errors = items.flatMap((item) => item.errors);
    if (errors.length) {
      return { fileUpload: errors };
    }
    if (
      files.length !== items.length ||
      items.some((item, index) => item.file !== files[index] || item.status !== 'success')
    ) {
      return { uploadPending: true };
    }
    return null;
  }

  /** Updates file values only when selections change; status updates only revalidate the control and summary. */
  private syncFilesControl(): void {
    const files = this.fileUploads().map((item) => item.file);
    const currentFiles = this.uploadControl.value ?? [];
    if (files.length !== currentFiles.length || files.some((file, index) => file !== currentFiles[index])) {
      this.formSubmitted = false;
      this.uploadControl.markAsDirty();
      this.uploadControl.setValue(files);
    } else {
      this.uploadControl.updateValueAndValidity();
    }
    if (this.formErrorSummaryMessage?.length) {
      this.handleErrorMessages();
    }
  }

  /** Attach to the consuming file control to include supplied upload state in standard form validation. */
  protected readonly fileUploadValidator: ValidatorFn = (control) => this.validateFilesControl(control);

  /** Returns filename-prefixed row errors, falling back to the form's current control error. */
  public get fileInputErrors(): readonly string[] {
    const errors = this.fileErrors();
    if (errors.length) {
      return errors;
    }

    const controlError = this.formControlErrorMessages?.[this.uploadControlName];
    return controlError ? [controlError] : [];
  }

  /** Emits a non-empty selection for the parent to validate and upload when the file control is enabled. */
  public onFilesSelected(files: readonly File[]): void {
    if (!this.uploadControl.disabled && files.length) {
      this.filesSelected.emit(files);
    }
  }

  /** Resets the child form and asks the parent to clear rows, announcements and outstanding requests. */
  public override handleClearForm(): void {
    this.formSubmitted = false;
    super.handleClearForm();
    this.setInitialErrorMessages();
    this.filesCleared.emit();
  }

  /** Initialises error messages before the inherited form listeners begin observing changes. */
  public override ngOnInit(): void {
    this.setInitialErrorMessages();
    super.ngOnInit();
  }
}
