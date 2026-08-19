import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-deferred-live-region-announcement',
  templateUrl: './custom-deferred-live-region-announcement.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDeferredLiveRegionAnnouncement {
  // Populate the live region after it has been rendered empty so assistive
  // technologies detect the subsequent content change as an announcement.
  private static readonly ANNOUNCEMENT_DELAY_MS = 100;
  protected readonly renderedMessage = signal('');

  readonly message = input.required<string>();
  readonly role = input<'status' | 'alert'>('status');

  constructor() {
    effect((onCleanup) => {
      const message = this.message();

      this.renderedMessage.set('');

      if (!message) {
        return;
      }

      const timeoutId = setTimeout(() => {
        this.renderedMessage.set(message);
      }, CustomDeferredLiveRegionAnnouncement.ANNOUNCEMENT_DELAY_MS);

      onCleanup(() => clearTimeout(timeoutId));
    });
  }
}
