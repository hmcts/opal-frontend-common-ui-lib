import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-dismiss',
  imports: [],
  templateUrl: './moj-alert-dismiss.component.html',
})
export class MojAlertDismissComponent {
  @Output() dismiss = new EventEmitter<void>();
}
