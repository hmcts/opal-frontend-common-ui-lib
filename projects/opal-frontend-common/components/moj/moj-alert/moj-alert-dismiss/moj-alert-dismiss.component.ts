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
   *
   * If an event is provided, its default behavior is prevented before emitting the dismiss event.
   *
   * @param event An optional DOM event that triggered the dismissal.
   */
  public dismissAlert(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.dismiss.emit();
  }
}
