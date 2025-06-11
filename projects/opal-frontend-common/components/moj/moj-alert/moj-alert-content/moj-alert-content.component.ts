import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-content',
  imports: [],
  templateUrl: './moj-alert-content.component.html',
})
export class MojAlertContentComponent {
  @HostBinding('class') hostClass = 'moj-alert__content';
}
