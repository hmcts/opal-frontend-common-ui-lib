import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'opal-lib-custom-deferred-live-region-announcement',
  templateUrl: './custom-deferred-live-region-announcement.component.html',
  styleUrl: './custom-deferred-live-region-announcement.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDeferredLiveRegionAnnouncement implements OnChanges, OnDestroy {
  // Populate the live region after it has been rendered empty so assistive
  // technologies detect the subsequent content change as an announcement.
  private static readonly DEFAULT_ANNOUNCEMENT_DELAY_MS = 100;

  private readonly injector = inject(Injector);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private browserRendered = false;
  private _announcementDelayMs = CustomDeferredLiveRegionAnnouncement.DEFAULT_ANNOUNCEMENT_DELAY_MS;

  protected readonly renderedMessage = signal('');

  @Input({ required: true }) public message!: string;
  @Input({ required: false }) public role: 'status' | 'alert' = 'status';

  /**
   * Sets the announcement delay in milliseconds.
   *
   * @throws Error when the value is negative or not finite.
   */
  @Input({ required: false })
  public set announcementDelayMs(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error('announcementDelayMs must be a non-negative finite number.');
    }

    this._announcementDelayMs = value;
  }

  /**
   * Schedules the initial announcement after the first browser render so the
   * live region is present and empty before its content changes.
   */
  private scheduleInitialAnnouncement(): void {
    afterNextRender(
      () => {
        this.browserRendered = true;
        this.scheduleAnnouncement();
      },
      { injector: this.injector },
    );
  }

  /**
   * Clears any pending announcement and the current live-region content before
   * scheduling the latest message using the configured delay.
   *
   * Stores the timer in `timeoutId` so it can be cancelled if the message or
   * delay changes before the announcement occurs.
   */
  private scheduleAnnouncement(): void {
    this.clearPendingAnnouncement();
    this.renderedMessage.set('');

    if (!this.message) {
      return;
    }

    const message = this.message;

    this.timeoutId = setTimeout(() => {
      this.renderedMessage.set(message);
      this.timeoutId = null;
    }, this.announcementDelayMs);
  }

  /**
   * Cancels the currently pending announcement, if any, and clears the stored
   * timer reference.
   */
  private clearPendingAnnouncement(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Returns the configured announcement delay in milliseconds.
   */
  public get announcementDelayMs(): number {
    return this._announcementDelayMs;
  }

  /**
   * Responds to announcement-related input changes.
   *
   * Message changes schedule an announcement, using a browser-only post-render
   * callback before the component's first browser render. Delay changes only
   * reschedule an announcement when one is already pending.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      if (this.browserRendered) {
        this.scheduleAnnouncement();
      } else {
        this.scheduleInitialAnnouncement();
      }
      return;
    }

    if (changes['announcementDelayMs'] && this.timeoutId !== null) {
      this.scheduleAnnouncement();
    }
  }

  /**
   * Cancels any pending announcement when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.clearPendingAnnouncement();
  }
}
