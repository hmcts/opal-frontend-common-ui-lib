import { Component, Input } from '@angular/core';

export type GovukBannerType = 'success' | 'information';
let nextNotificationBannerId = 0;

@Component({
  selector: 'opal-lib-govuk-notification-banner',
  imports: [],
  templateUrl: './govuk-notification-banner.component.html',
})
export class GovukNotificationBannerComponent {
  private readonly generatedTitleId = `govuk-notification-banner-title-${++nextNotificationBannerId}`;

  @Input({ required: true }) titleText!: string;
  @Input({ required: true }) headingText!: string;
  @Input({ required: true }) messageText!: string;
  @Input({ required: true }) type: GovukBannerType = 'success';
  @Input({ required: false }) titleId?: string;

  /**
   * Resolves the title ID, preferring the provided one.
   */
  get computedTitleId(): string {
    return this.titleId ?? this.generatedTitleId;
  }
}
