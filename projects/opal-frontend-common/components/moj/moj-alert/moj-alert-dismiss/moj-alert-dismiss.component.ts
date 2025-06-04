import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-dismiss',
  imports: [],
  templateUrl: './moj-alert-dismiss.component.html',
})
export class MojAlertDismissComponent {
  @HostBinding('class') class = 'moj-alert__dismiss';
  @Output() dismiss = new EventEmitter<void>();

  dismissAlert(): void {
    this.dismiss.emit();
  }
}
