import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

let nextTabsId = 0;

@Component({
  selector: 'opal-lib-govuk-tabs',
  templateUrl: './govuk-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly ngUnsubscribe = new Subject<void>();

  @Input({ required: false }) public tabId = `govuk-tabs-${++nextTabsId}`;
  @Input({ required: false }) public titleText = 'Contents';
  @Output() public activeTabFragmentChange = new EventEmitter<string>();

  /**
   * Returns the ID for the tabs title element.
   */
  get titleId(): string {
    return `${this.tabId}-title`;
  }

  /**
   * Subscribes to URL fragment changes and emits active tab updates.
   */
  private setupListeners(): void {
    this.route.fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (fragment) {
        this.activeTabFragmentChange.emit(fragment);
      }
    });
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   * Initializes the component by setting up necessary event listeners.
   *
   * @remarks
   * This method is part of the Angular OnInit lifecycle interface.
   */
  public ngOnInit(): void {
    this.setupListeners();
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from the route fragment subscription.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // GOV.UK tabs keyboard navigation is handled by govuk-frontend JavaScript when enabled.
}
