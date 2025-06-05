import { Component, HostBinding, Input } from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';
import { CommonModule } from '@angular/common';
import { MojAlertDismissComponent } from './moj-alert-dismiss/moj-alert-dismiss.component';

@Component({
  selector: 'opal-lib-moj-alert, [opal-lib-moj-alert]',
  imports: [CommonModule, MojAlertDismissComponent],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent {
  @Input({ required: true }) ariaLabel: string = '';
  @Input({ required: true }) type: MojAlertType = 'information';
  @Input({ required: false }) showDismiss: boolean = false;

  @HostBinding('class')
  get hostClass(): string {
    return !this.isVisible ? '' : `moj-alert moj-alert--${this.type}`;
  }
  @HostBinding('attr.aria-label')
  get computedAriaLabel(): string {
    return `${this.type} : ${this.ariaLabel}`;
  }
  @HostBinding('data-module') dataModule = 'moj-alert';

  public isVisible = true;

  dismiss(): void {
    this.isVisible = false;
  }
}
