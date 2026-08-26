import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';
import { CustomDeferredLiveRegionAnnouncement } from '@hmcts/opal-frontend-common/components/custom/custom-deferred-live-region-announcement';
import { MojAlertDismissComponent } from './moj-alert-dismiss/moj-alert-dismiss.component';

@Component({
  selector: 'opal-lib-moj-alert, [opal-lib-moj-alert]',
  imports: [MojAlertDismissComponent, CustomDeferredLiveRegionAnnouncement],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent {
  /**
   * Accessible label used for live announcements.
   *
   * Required when `enableLiveAnnouncement` is true.
   */
  @Input({ required: false }) ariaLabel?: string;
  /**
   * Controls whether the alert creates a live-region announcement.
   *
   * Defaults to `true`. When enabled, `ariaLabel` must be provided.
   */
  @Input({ required: false }) enableLiveAnnouncement = true;
  @Input({ required: true }) type: MojAlertType = 'information';
  @Input({ required: false }) showDismiss!: boolean;

  @Output() dismissed = new EventEmitter<void>();

  public isVisible: boolean = true;

  @HostBinding('class')
  get hostClass(): string {
    return this.isVisible ? `moj-alert moj-alert--${this.type}` : '';
  }

  @HostBinding('attr.data-module') dataModule = 'moj-alert';

  /**
   * Returns the message used for the live-region announcement.
   *
   * @returns The alert type and accessible label formatted as an announcement message.
   * @throws {Error} If `ariaLabel`, empty, or contains only whitespace.
   */
  public get announcementMessage(): string {
    if (!this.ariaLabel?.trim()) {
      throw new Error(
        'MojAlertComponent requires ariaLabel when live announcements are enabled. ' +
          'Provide ariaLabel or set enableLiveAnnouncement to false.',
      );
    }
    return `${this.type}: ${this.ariaLabel}`;
  }

  public get announcementRole(): 'alert' | 'status' {
    return this.type === 'error' || this.type === 'warning' ? 'alert' : 'status';
  }

  /**
   * Dismisses the alert component.
   *
   * This method emits the dismissed event to its parent and
   * sets the component's visibility state to false,
   * effectively hiding the alert from view.
   */
  public dismiss(): void {
    this.isVisible = false;
    this.dismissed.emit();
  }
}
