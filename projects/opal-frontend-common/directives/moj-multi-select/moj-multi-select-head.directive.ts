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
  @Input() extraClasses: string = '';
  @Input() selectAllIndeterminate: boolean = false;
  @Input() ariaLabel: string = 'Select all rows';

  @Output() toggleAll = new EventEmitter<boolean>();

  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly baseClasses = 'govuk-checkboxes__item govuk-checkboxes--small moj-multi-select__checkbox';

  @HostBinding('class')
  public get classes(): string {
    return `${this.baseClasses} ${this.extraClasses}`.trim();
  }

  public ngOnInit(): void {
    this.syncInputState();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectAllIndeterminate'] || changes['ariaLabel']) {
      this.syncInputState();
    }
  }

  @HostListener('change', ['$event'])
  public onCheckboxChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.toggleAll.emit(target.checked);
  }

  private syncInputState(): void {
    const checkboxInput = getCheckboxInputFromHost(this.hostElementRef.nativeElement);

    if (!checkboxInput) {
      return;
    }

    checkboxInput.indeterminate = this.selectAllIndeterminate;
    checkboxInput.setAttribute('aria-label', this.ariaLabel);
  }
}
