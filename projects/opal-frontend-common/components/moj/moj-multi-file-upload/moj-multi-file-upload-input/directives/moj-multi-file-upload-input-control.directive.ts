import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MOJ_MULTI_FILE_UPLOAD_DEFAULT_MAX_FILES } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/constants';

/** Bridges browser file selections to reactive forms without assigning files to the native input. */
@Directive({
  selector: 'input[type=file][opalLibMojMultiFileUploadInputControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MojMultiFileUploadInputControlDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MojMultiFileUploadInputControlDirective),
      multi: true,
    },
  ],
})
export class MojMultiFileUploadInputControlDirective implements ControlValueAccessor, Validator {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private disabled = false;
  private maximumFiles = MOJ_MULTI_FILE_UPLOAD_DEFAULT_MAX_FILES;
  private rejectedFileCount: number | null = null;

  /** Uses a positive selection limit, falling back to the shared default for invalid configuration. */
  @Input() public set maxFiles(value: number | null | undefined) {
    this.maximumFiles =
      typeof value === 'number' && Number.isInteger(value) && value > 0
        ? value
        : MOJ_MULTI_FILE_UPLOAD_DEFAULT_MAX_FILES;
    if (this.rejectedFileCount !== null && this.rejectedFileCount <= this.maximumFiles) {
      this.rejectedFileCount = null;
    }
    this.validatorChange();
    this.changeDetectorRef.markForCheck();
  }
  @Output() public filesSelected = new EventEmitter<readonly File[]>();

  private change: (value: readonly File[] | null) => void = () => undefined;
  private touched: () => void = () => undefined;
  private validatorChange: () => void = () => undefined;

  /** Returns the effective limit for one picker or dropped batch. */
  public get maxFiles(): number {
    return this.maximumFiles;
  }

  /** Clears native selection and resets a rejected batch when the consumer clears the file model. */
  public writeValue(value?: readonly File[] | null): void {
    // Browsers only permit clearing a file input programmatically, regardless of the model value.
    this.elementRef.nativeElement.value = '';
    if (!value?.length) {
      this.rejectedFileCount = null;
    }
    this.changeDetectorRef.markForCheck();
  }

  /** Registers Angular forms' callback for user-selected files. */
  public registerOnChange(callback: (value: readonly File[] | null) => void): void {
    this.change = callback;
  }

  /** Registers Angular forms' callback for a touched file control. */
  public registerOnTouched(callback: () => void): void {
    this.touched = callback;
  }

  /** Registers Angular forms' callback for selection-limit changes that do not replace the file model. */
  public registerOnValidatorChange(callback: () => void): void {
    this.validatorChange = callback;
  }

  /** Reports only a rejected user batch; cumulative programmatic file values are not selection counts. */
  public validate(): ValidationErrors | null {
    return this.rejectedFileCount === null
      ? null
      : { maxFiles: { maxFiles: this.maximumFiles, actualFiles: this.rejectedFileCount } };
  }

  /** Applies the control's disabled state to native and accessor interactions. */
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.elementRef.nativeElement.disabled = disabled;
    this.changeDetectorRef.markForCheck();
  }

  /** Converts the browser FileList to the shared selection pipeline. */
  @HostListener('change')
  public onFilesChanged(): void {
    this.selectFiles(Array.from(this.elementRef.nativeElement.files ?? []));
  }

  /** Rejects an over-limit batch before changing the model; returns whether files were emitted for upload. */
  public selectFiles(files: readonly File[]): boolean {
    if (this.disabled || files.length === 0) {
      return false;
    }
    const selectedFiles = [...files];
    this.elementRef.nativeElement.value = '';
    this.rejectedFileCount = selectedFiles.length > this.maximumFiles ? selectedFiles.length : null;
    this.changeDetectorRef.markForCheck();
    if (this.rejectedFileCount !== null) {
      // Rejected batches bypass the forms change pipeline, so revalidate them explicitly.
      this.validatorChange();
      return false;
    }
    this.change(selectedFiles);
    this.filesSelected.emit(selectedFiles);
    return true;
  }

  /** Marks an enabled control touched and commits updateOn blur selections. */
  @HostListener('blur')
  public onBlur(): void {
    if (!this.disabled) {
      this.touched();
    }
  }
}
