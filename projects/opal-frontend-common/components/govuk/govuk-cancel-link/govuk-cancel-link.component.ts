import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-cancel-link',
  imports: [],
  templateUrl: './govuk-cancel-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCancelLinkComponent {
  @Input({ required: false }) cancelLinkText = 'Cancel';
  @Output() linkClickEvent = new EventEmitter<boolean>();

  /**
   * Handles the button click event.
   */
  public handleClick(event?: Event): void {
    event?.preventDefault();
    this.linkClickEvent.emit(true);
  }
}
