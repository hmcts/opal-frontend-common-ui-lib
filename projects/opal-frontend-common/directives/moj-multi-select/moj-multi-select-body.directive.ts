import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MultiSelectRowIdentifier } from './types/moj-multi-select.types';
import { getCheckboxInputFromHost } from './utils/moj-multi-select-directive.utils';

@Directive({
  selector:
    'opal-lib-govuk-checkboxes-item[opalLibMojMultiSelectBody], [opal-lib-govuk-checkboxes-item][opalLibMojMultiSelectBody]',
})
export class MojMultiSelectBodyDirective implements OnInit, OnChanges {
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly baseClasses = 'govuk-checkboxes__item moj-multi-select__checkbox body-checkbox';

  @Input({ required: true }) rowId!: MultiSelectRowIdentifier;
  @Input() ariaLabel: string = '';
  @Input() extraClasses: string = '';

  @Output() selectionChange = new EventEmitter<{ rowId: MultiSelectRowIdentifier; checked: boolean }>();

  /**
   * Synchronises the nested checkbox aria-label based on directive inputs.
   */
  private syncInputState(): void {
    const checkboxInput = getCheckboxInputFromHost(this.hostElementRef.nativeElement);

    if (!checkboxInput) {
      return;
    }

    const customAriaLabel = this.ariaLabel.trim();

    if (customAriaLabel) {
      checkboxInput.setAttribute('aria-label', customAriaLabel);
    } else {
      checkboxInput.removeAttribute('aria-label');
    }
  }

  @HostBinding('class')
  /**
   * Returns the host CSS classes for the body row checkbox item.
   */
  public get classes(): string {
    return `${this.baseClasses} ${this.extraClasses}`.trim();
  }

  /**
   * Applies initial input aria-label after directive initialisation.
   */
  public ngOnInit(): void {
    this.syncInputState();
  }

  /**
   * Re-syncs checkbox aria-label when aria-related inputs change.
   *
   * @param changes - Angular change map for current input updates.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ariaLabel']) {
      this.syncInputState();
    }
  }

  @HostListener('change', ['$event'])
  /**
   * Emits row id and checked state when the row checkbox changes.
   *
   * @param event - Native change event from the checkbox.
   */
  public onCheckboxChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.selectionChange.emit({ rowId: this.rowId, checked: target.checked });
  }
}
