import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GovukTabsListItemComponent } from './govuk-tabs-list-item/govuk-tabs-list-item.component';

let nextTabsId = 0;

@Component({
  selector: 'opal-lib-govuk-tabs',
  templateUrl: './govuk-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly ngUnsubscribe = new Subject<void>();
  @ContentChildren(GovukTabsListItemComponent, { descendants: true })
  private readonly tabItems?: QueryList<GovukTabsListItemComponent>;

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
   * Moves focus by an offset from the current tab and activates it.
   */
  private focusTabByOffset(current: GovukTabsListItemComponent, offset: number): void {
    const tabs = this.tabItems?.toArray() ?? [];
    if (!tabs.length) {
      return;
    }

    const currentIndex = tabs.indexOf(current);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
    const target = tabs[nextIndex];
    target.focus();
    target.activate(target.tabItemFragment);
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

  /**
   * Moves focus to the next tab.
   */
  public focusNextTab(current: GovukTabsListItemComponent): void {
    this.focusTabByOffset(current, 1);
  }

  /**
   * Moves focus to the previous tab.
   */
  public focusPreviousTab(current: GovukTabsListItemComponent): void {
    this.focusTabByOffset(current, -1);
  }

  /**
   * Focuses and activates the first tab.
   */
  public focusFirstTab(): void {
    const tabs = this.tabItems?.toArray() ?? [];
    if (!tabs.length) {
      return;
    }
    const target = tabs[0];
    target.focus();
    target.activate(target.tabItemFragment);
  }

  /**
   * Focuses and activates the last tab.
   */
  public focusLastTab(): void {
    const tabs = this.tabItems?.toArray() ?? [];
    if (!tabs.length) {
      return;
    }
    const target = tabs[tabs.length - 1];
    target.focus();
    target.activate(target.tabItemFragment);
  }
}
