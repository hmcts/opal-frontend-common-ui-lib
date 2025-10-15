import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-summary-card-action, [opal-lib-govuk-summary-card-action]',
  imports: [],
  templateUrl: './govuk-summary-card-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryCardActionComponent {
  @Input({ required: true }) actionText!: string;
  @Input({ required: true }) actionRoute!: string;
  @Input({ required: false }) visuallyHiddenText!: string;
  @Output() clickEvent = new EventEmitter<string>();

  @HostBinding('class') hostClass = 'govuk-summary-card__action';

  /**
   * Handles click events, prevents default behavior, and emits a route.
   *
   * @param {Event} event - The DOM event triggered by the user action.
   * @param {string} route - The route to be emitted when the event is triggered.
   */
  public onClick(event: Event, route: string): void {
    event.preventDefault();
    this.clickEvent.emit(route);
  }
}
