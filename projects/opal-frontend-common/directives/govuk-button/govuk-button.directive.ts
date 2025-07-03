import { Directive, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[opalLibGovukButton]',
})
export class GovukButtonDirective {
  @Input({ required: true }) buttonId!: string;
  @Input() buttonClasses: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'submit';
  @Output() buttonClickEvent = new EventEmitter<boolean>();

  @HostBinding('attr.id') get id() {
    return this.buttonId;
  }

  @HostBinding('attr.type') get buttonType() {
    return this.type;
  }

  @HostBinding('class') get classes() {
    return `govuk-button ${this.buttonClasses}`.trim();
  }

  @HostBinding('attr.data-module') dataModule = 'govuk-button';

  /**
   * Handles the button click event.
   */
  public handleButtonClick(): void {
    this.buttonClickEvent.emit(true);
  }
}
