import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { MojPrimaryNavigationItemComponent } from './moj-primary-navigation-item/moj-primary-navigation-item.component';

@Component({
  selector: 'opal-lib-moj-primary-navigation',
  templateUrl: './moj-primary-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPrimaryNavigationComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  private readonly route = inject(ActivatedRoute);
  private readonly ngUnsubscribe = new Subject<void>();
  private itemSubscriptions: Subscription[] = [];

  @ContentChildren(MojPrimaryNavigationItemComponent)
  private readonly primaryNavigationItems!: QueryList<MojPrimaryNavigationItemComponent>;

  @Input({ required: true }) public primaryNavigationId!: string;
  @Input({ required: false }) public useFragmentNavigation: boolean = true;
  @Output() activeItemFragment = new EventEmitter<string>();
  @Output() navigationItemSelected = new EventEmitter<string>();

  /**
   * Synchronise the projected item mode and selection events with the container mode.
   */
  private wirePrimaryNavigationItems(): void {
    this.itemSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.itemSubscriptions = [];

    this.primaryNavigationItems.forEach((item) => {
      item.useFragmentNavigation = this.useFragmentNavigation;
      this.itemSubscriptions.push(
        item.navigationItemSelected.subscribe((selectedItem) => this.navigationItemSelected.emit(selectedItem)),
      );
    });
  }

  /**
   * Sets up the listeners for the route fragment changes.
   * Emits the active navigation item when a fragment is present in the route.
   */
  private setupListeners(): void {
    // Basically we want to mimic the behaviour of the GDS tabs component, as this is how these will be used.
    this.route.fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (!this.useFragmentNavigation) {
        return;
      }

      if (fragment) {
        this.activeItemFragment.emit(fragment);
      }
    });
  }

  /**
   * Initializes the component.
   * This method is called after the component has been created and initialized.
   */
  public ngOnInit(): void {
    this.setupListeners();
  }

  /**
   * Wire projected navigation item events after content is available.
   */
  public ngAfterContentInit(): void {
    this.primaryNavigationItems.changes
      .pipe(startWith(this.primaryNavigationItems), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.wirePrimaryNavigationItems();
      });
  }

  /**
   * Keep projected items in sync if navigation mode input changes after initial render.
   * @param changes - The input change set.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    const useFragmentNavigationChange = changes['useFragmentNavigation'];
    if (useFragmentNavigationChange && this.primaryNavigationItems) {
      this.wirePrimaryNavigationItems();
    }

    if (useFragmentNavigationChange?.currentValue === true && useFragmentNavigationChange.previousValue === false) {
      const currentFragment = this.route.snapshot?.fragment;
      if (currentFragment) {
        this.activeItemFragment.emit(currentFragment);
      }
    }
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from the route fragment subscription.
   */
  public ngOnDestroy(): void {
    this.itemSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
