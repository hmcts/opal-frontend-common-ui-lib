import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-content-heading',
  imports: [],
  templateUrl: './moj-alert-content-heading.component.html',
})
export class MojAlertHeadingComponent {
  @HostBinding('class') hostClass = 'moj-alert__heading';
}
