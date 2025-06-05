import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-dismiss',
  imports: [],
  templateUrl: './moj-alert-dismiss.component.html',
})
export class MojAlertDismissComponent {
  @HostBinding('class') hostClass = 'moj-alert__action';
  @Output() public dismiss = new EventEmitter<void>();

  /**
   * Dismisses the alert.
   * If a click event is provided, it will prevent the default behavior
   * and stop propagation for additional control.
   *
   * @param event Optional mouse event from the click.
   */
  public dismissAlert(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.dismiss.emit();
  }
}
