import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';

import { MojAlertDismissComponent } from './moj-alert-dismiss/moj-alert-dismiss.component';

@Component({
  selector: 'opal-lib-moj-alert, [opal-lib-moj-alert]',
  imports: [MojAlertDismissComponent],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent implements AfterViewInit, OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  @Input({ required: true }) ariaLabel!: string;
  @Input({ required: true }) type: MojAlertType = 'information';
  @Input({ required: false }) showDismiss!: boolean;
  @Output() dismissed = new EventEmitter<void>();

  private announcementTimeoutId?: ReturnType<typeof setTimeout>;
  public isVisible: boolean = true;
  public announcementText: string = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.isVisible ? `moj-alert moj-alert--${this.type}` : '';
  }
  @HostBinding('attr.data-module') dataModule = 'moj-alert';

  public ngAfterViewInit(): void {
    if (!this.isVisible) {
      return;
    }

    this.announcementTimeoutId = setTimeout(() => {
      this.announcementText = this.computedAnnouncementText;
      this.changeDetectorRef.detectChanges();
    });
  }

  public get announcementRole(): 'alert' | 'status' {
    return this.type === 'error' || this.type === 'warning' ? 'alert' : 'status';
  }

  private get computedAnnouncementText(): string {
    return `${this.type} : ${this.ariaLabel}`;
  }

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

  public ngOnDestroy(): void {
    if (this.announcementTimeoutId) {
      clearTimeout(this.announcementTimeoutId);
    }
  }
}
