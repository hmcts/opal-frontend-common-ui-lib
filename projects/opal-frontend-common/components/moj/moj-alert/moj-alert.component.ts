import { Component, Input } from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';

@Component({
  selector: 'opal-lib-moj-alert',
  imports: [],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent {
  @Input({ required: true }) text: string = '';
  @Input({ required: true }) type: MojAlertType = 'information';
  @Input({ required: false }) icon: boolean = true;
  @Input({ required: false }) dismissible: boolean = false;
  @Input({ required: false }) heading: string = '';

  public isVisible: boolean = true;

  handleDismiss(): void {
    this.isVisible = false;
  }
}
