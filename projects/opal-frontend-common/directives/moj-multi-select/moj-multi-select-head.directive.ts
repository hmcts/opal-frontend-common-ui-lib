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
import { getCheckboxInputFromHost } from './utils/moj-multi-select-directive.utils';

@Directive({
  selector:
    'opal-lib-govuk-checkboxes-item[opalLibMojMultiSelectHead], [opal-lib-govuk-checkboxes-item][opalLibMojMultiSelectHead]',
})
export class MojMultiSelectHeadDirective implements OnInit, OnChanges {
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly baseClasses = 'govuk-checkboxes__item moj-multi-select__checkbox';

  @Input() extraClasses: string = '';
  @Input() selectAllIndeterminate: boolean = false;
  @Input() ariaLabel: string = 'Select all rows';

  @Output() toggleAll = new EventEmitter<boolean>();

  /**
   * Synchronises the nested checkbox UI state with directive inputs.
   * Updates indeterminate and aria-label when the input element is present.
   */
  private syncInputState(): void {
    const checkboxInput = getCheckboxInputFromHost(this.hostElementRef.nativeElement);

    if (!checkboxInput) {
      return;
    }

    checkboxInput.indeterminate = this.selectAllIndeterminate;
    checkboxInput.setAttribute('aria-label', this.ariaLabel);
  }

  @HostBinding('class')
  /**
   * Returns the host CSS classes for the select-all checkbox item.
   */
  public get classes(): string {
    return `${this.baseClasses} ${this.extraClasses}`.trim();
  }

  /**
   * Applies the initial checkbox aria and indeterminate state after init.
   */
  public ngOnInit(): void {
    this.syncInputState();
  }

  /**
   * Re-syncs checkbox state when relevant inputs change.
   *
   * @param changes - Angular change map for current input updates.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectAllIndeterminate'] || changes['ariaLabel']) {
      this.syncInputState();
    }
  }

  @HostListener('change', ['$event'])
  /**
   * Emits the latest select-all checked state when the host checkbox changes.
   *
   * @param event - Native change event from the checkbox.
   */
  public onCheckboxChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.toggleAll.emit(target.checked);
  }
}
