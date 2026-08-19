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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDeferredLiveRegionAnnouncement implements OnChanges, OnDestroy {
  // Populate the live region after it has been rendered empty so assistive
  // technologies detect the subsequent content change as an announcement.
  private static readonly DEFAULT_ANNOUNCEMENT_DELAY_MS = 100;

  private readonly injector = inject(Injector);
  private timeoutId?: ReturnType<typeof setTimeout>;
  private browserRendered = false;
  private renderScheduled = false;
  private _announcementDelayMs = CustomDeferredLiveRegionAnnouncement.DEFAULT_ANNOUNCEMENT_DELAY_MS;

  protected readonly renderedMessage = signal('');

  @Input({ required: true }) public message!: string;
  @Input() public role: 'status' | 'alert' = 'status';

  @Input()
  public set announcementDelayMs(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error('announcementDelayMs must be a non-negative finite number.');
    }

    this._announcementDelayMs = value;
  }

  private scheduleInitialAnnouncement(): void {
    if (this.renderScheduled) {
      return;
    }

    this.renderScheduled = true;

    afterNextRender(
      () => {
        this.browserRendered = true;
        this.renderScheduled = false;
        this.scheduleAnnouncement();
      },
      { injector: this.injector },
    );
  }

  private scheduleAnnouncement(): void {
    this.clearPendingAnnouncement();
    this.renderedMessage.set('');

    if (!this.message) {
      return;
    }

    const message = this.message;

    this.timeoutId = setTimeout(() => {
      this.renderedMessage.set(message);
      this.timeoutId = undefined;
    }, this.announcementDelayMs);
  }

  private clearPendingAnnouncement(): void {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  public get announcementDelayMs(): number {
    return this._announcementDelayMs;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      if (this.browserRendered) {
        this.scheduleAnnouncement();
      } else {
        this.scheduleInitialAnnouncement();
      }
      return;
    }

    if (changes['announcementDelayMs'] && this.timeoutId !== undefined) {
      this.scheduleAnnouncement();
    }
  }

  public ngOnDestroy(): void {
    this.clearPendingAnnouncement();
  }
}
