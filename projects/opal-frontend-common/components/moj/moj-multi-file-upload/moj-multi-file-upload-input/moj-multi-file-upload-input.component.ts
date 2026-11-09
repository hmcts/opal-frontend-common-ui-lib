import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MojMultiFileUploadInputControlDirective } from './directives/moj-multi-file-upload-input-control.directive';

@Component({
  selector: 'opal-lib-moj-multi-file-upload-input',
  imports: [ReactiveFormsModule, MojMultiFileUploadInputControlDirective],
  templateUrl: './moj-multi-file-upload-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojMultiFileUploadInputComponent {
  private _control!: FormControl<readonly File[] | null>;

  @ViewChild('fileInput') private readonly fileInput?: ElementRef<HTMLInputElement>;
  @ViewChild(MojMultiFileUploadInputControlDirective)
  private readonly fileControl?: MojMultiFileUploadInputControlDirective;

  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: true }) labelText!: string;
  @Input() labelClasses = 'govuk-label--m';
  @Input() inputClasses = '';
  @Input() hintText: string | null = null;
  @Input() dropzoneHintText = 'Drag and drop files here or';
  @Input() buttonText = 'Choose files';
  @Input() uploadButtonText = 'Upload file';
  @Input() multiple = true;
  @Input() acceptedTypes: readonly string[] = [];
  @Input() errors: readonly string[] = [];
  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    this._control = abstractControl as FormControl<readonly File[] | null>;
  }
  @Output() readonly filesSelected = new EventEmitter<readonly File[]>();

  public draggingOver = false;
  public focused = false;

  /** Returns the consumer-owned file control used by the value accessor. */
  public get getControl(): FormControl<readonly File[] | null> {
    return this._control;
  }

  /** Reflects the disabled state of the consumer-owned control. */
  public get disabled(): boolean {
    return this.getControl.disabled;
  }

  /** Associates the native input with its visible hint and supplied errors. */
  public get describedBy(): string {
    return [
      this.hintText ? `${this.inputId}-hint` : '',
      `${this.inputId}-dropzone-hint`,
      this.errors.length ? `${this.inputId}-error` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** Forwards the selection after the value accessor updates the control. */
  public onFilesSelected(files: readonly File[]): void {
    this.filesSelected.emit(files);
  }

  /** Prevents browser navigation and highlights an enabled drop target. */
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.draggingOver = !this.disabled;
  }

  /** Clears the temporary drag highlight when files leave the drop target. */
  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.draggingOver = false;
  }

  /** Sends dropped files through the accessor and commits blur-based controls. */
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.draggingOver = false;
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (!this.disabled && files.length > 0) {
      this.fileControl?.selectFiles(files);
      this.fileControl?.onBlur();
    }
  }

  /** Focuses the native file input once the view is available. */
  public focus(): void {
    this.fileInput?.nativeElement.focus();
  }
}
