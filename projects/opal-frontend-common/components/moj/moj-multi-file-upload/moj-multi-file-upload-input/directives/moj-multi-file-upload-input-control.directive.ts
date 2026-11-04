import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Bridges browser file selections to reactive forms without assigning files to the native input. */
@Directive({
  selector: 'input[type=file][opalLibMojMultiFileUploadInputControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MojMultiFileUploadInputControlDirective),
      multi: true,
    },
  ],
})
export class MojMultiFileUploadInputControlDirective implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private disabled = false;
  @Output() public filesSelected = new EventEmitter<readonly File[]>();

  private change: (value: readonly File[] | null) => void = () => undefined;
  private touched: () => void = () => undefined;

  /** Clears native selection without writing a filename or emitting a change. */
  public writeValue(value: readonly File[] | null): void {
    // Browsers only permit clearing a file input programmatically, regardless of the model value.
    void value;
    this.elementRef.nativeElement.value = '';
  }

  /** Registers Angular forms' callback for user-selected files. */
  public registerOnChange(callback: (value: readonly File[] | null) => void): void {
    this.change = callback;
  }

  /** Registers Angular forms' callback for a touched file control. */
  public registerOnTouched(callback: () => void): void {
    this.touched = callback;
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

  /** Snapshots selected files, updates the form and emits one selection event. */
  public selectFiles(files: readonly File[]): void {
    if (this.disabled || files.length === 0) {
      return;
    }
    const selectedFiles = [...files];
    this.elementRef.nativeElement.value = '';
    this.change(selectedFiles);
    this.filesSelected.emit(selectedFiles);
  }

  /** Marks an enabled control touched and commits updateOn blur selections. */
  @HostListener('blur')
  public onBlur(): void {
    if (!this.disabled) {
      this.touched();
    }
  }
}
