import { DOCUMENT } from '@angular/common';
import { Directive, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Directive({
  selector: '[opalLibCapitaliseAllCharacters]',
})
export class CapitalisationDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly utilsService = inject(UtilsService);
  private readonly document = inject(DOCUMENT);

  @Input('opalLibCapitaliseAllCharacters') control!: AbstractControl;

  /**
   * Captures the focused input or textarea selection before its value is uppercased.
   * Maps offsets through uppercase prefixes to account for expanding characters, such as ß becoming SS.
   *
   * @param value The current control value, which must match the focused input's value.
   * @returns The input and its mapped selection, or null when the value differs or selection is unsupported.
   */
  private captureSelection(value: string): {
    input: HTMLInputElement | HTMLTextAreaElement;
    start: number;
    end: number;
    direction: 'forward' | 'backward' | 'none';
  } | null {
    const activeElement = this.document.activeElement;
    if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
      return null;
    }

    const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
    const { selectionStart, selectionEnd, selectionDirection } = input;
    if (input.value !== value || typeof selectionStart !== 'number' || typeof selectionEnd !== 'number') {
      return null;
    }

    return {
      input,
      start: this.utilsService.upperCaseAllLetters(value.slice(0, selectionStart)).length,
      end: this.utilsService.upperCaseAllLetters(value.slice(0, selectionEnd)).length,
      direction: selectionDirection ?? 'none',
    };
  }

  ngOnInit(): void {
    if (!this.control) return;

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (typeof value === 'string' && value.length > 0) {
        const upper = this.utilsService.upperCaseAllLetters(value);
        if (value !== upper) {
          const selection = this.captureSelection(value);
          this.control.setValue(upper, { emitEvent: false });

          if (selection && selection.input === this.document.activeElement && selection.input.value === upper) {
            selection.input.setSelectionRange(selection.start, selection.end, selection.direction);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
