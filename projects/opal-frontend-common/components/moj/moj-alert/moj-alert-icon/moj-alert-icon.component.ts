import { Component, Input } from '@angular/core';
import { MojAlertPathDirective } from './moj-alert-path-directive/moj-alert-path.directive';
import { MojAlertType } from '../constants/alert-types.constant';
@Component({
  selector: 'opal-lib-moj-alert-icon',
  imports: [MojAlertPathDirective],
  templateUrl: './moj-alert-icon.component.html',
})
export class MojAlertIconComponent {
  @Input({ required: true }) type: MojAlertType = 'information';
}
