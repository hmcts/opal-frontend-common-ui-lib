import { Directive, HostListener, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[opalLibTrimLeadingTrailingWhitespace]',
  standalone: true,
})
export class TrimLeadingTrailingWhitespaceDirective {
  @Input('opalLibTrimLeadingTrailingWhitespace') control!: AbstractControl | null;

  @HostListener('focusout')
  onFocusOut(): void {
    const value = this.control?.value;

    if (typeof value !== 'string') {
      return;
    }

    const trimmedValue = value.trim();

    if (trimmedValue === value) {
      return;
    }

    this.control?.setValue(trimmedValue);
  }
}
