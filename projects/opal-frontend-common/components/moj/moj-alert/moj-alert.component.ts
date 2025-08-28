import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';
import { CommonModule } from '@angular/common';
import { MojAlertDismissComponent } from './moj-alert-dismiss/moj-alert-dismiss.component';

@Component({
  selector: 'opal-lib-moj-alert, [opal-lib-moj-alert]',
  imports: [CommonModule, MojAlertDismissComponent],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent {
  @Input({ required: true }) ariaLabel!: string;
  @Input({ required: true }) type: MojAlertType = 'information';
  @Input({ required: false }) showDismiss!: boolean;
  @Output() dismissed = new EventEmitter<void>();

  public isVisible: boolean = true;

  @HostBinding('class')
  get hostClass(): string {
    return !this.isVisible ? '' : `moj-alert moj-alert--${this.type}`;
  }
  @HostBinding('attr.aria-label')
  get computedAriaLabel(): string {
    return `${this.type} : ${this.ariaLabel}`;
  }
  @HostBinding('attr.data-module') dataModule = 'moj-alert';

  /**
   * Dismisses the alert component.
   *
   * This method emits the dismissed event to it's parent and
   * sets the component's visibility state to false,
   * effectively hiding the alert from view.
   */
  public dismiss(): void {
    this.isVisible = false;
    this.dismissed.emit();
  }
}
