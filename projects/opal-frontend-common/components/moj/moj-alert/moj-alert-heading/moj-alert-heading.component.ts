import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-alert-heading',
  imports: [],
  templateUrl: './moj-alert-heading.component.html',
})
export class MojAlertHeadingComponent {
  @Input({ required: true }) heading: string = '';
}
