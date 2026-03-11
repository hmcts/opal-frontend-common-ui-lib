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
import { getCheckboxInputFromHost, getDefaultBodyAriaLabel } from './utils/moj-multi-select-directive.utils';

@Directive({
  selector:
    'opal-lib-govuk-checkboxes-item[opalLibMojMultiSelectBody], [opal-lib-govuk-checkboxes-item][opalLibMojMultiSelectBody]',
})
export class MojMultiSelectBodyDirective implements OnInit, OnChanges {
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly baseClasses =
    'govuk-checkboxes__item govuk-checkboxes--small moj-multi-select__checkbox body-checkbox';

  @Input({ required: true }) rowId!: MultiSelectRowIdentifier;
  @Input() rowIndex: number = 0;
  @Input() ariaLabel: string = '';
  @Input() extraClasses: string = '';

  @Output() selectionChange = new EventEmitter<{ rowId: MultiSelectRowIdentifier; checked: boolean }>();

  private syncInputState(): void {
    const checkboxInput = getCheckboxInputFromHost(this.hostElementRef.nativeElement);

    if (!checkboxInput) {
      return;
    }

    checkboxInput.setAttribute('aria-label', this.rowAriaLabel);
  }

  @HostBinding('class')
  public get classes(): string {
    return `${this.baseClasses} ${this.extraClasses}`.trim();
  }

  public ngOnInit(): void {
    this.syncInputState();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ariaLabel'] || changes['rowIndex']) {
      this.syncInputState();
    }
  }

  public get rowAriaLabel(): string {
    return this.ariaLabel || getDefaultBodyAriaLabel(this.rowIndex);
  }

  @HostListener('change', ['$event'])
  public onCheckboxChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.selectionChange.emit({ rowId: this.rowId, checked: target.checked });
  }
}
