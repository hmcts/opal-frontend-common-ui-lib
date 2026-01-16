import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'opal-lib-govuk-tabs-list-item, [opal-lib-govuk-tabs-list-item]',
  templateUrl: './govuk-tabs-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsListItemComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  @ViewChild('tabLink', { static: true }) private readonly tabLink?: ElementRef<HTMLAnchorElement>;

  @Input({ required: false }) public tabItemId?: string;
  @Input({ required: true }) public tabItemFragment!: string;
  @Input({ required: true }) public activeTabItemFragment!: string;

  /**
   * Collects the tab anchors within the closest tabs list for keyboard navigation.
   */
  private getTabs(): HTMLAnchorElement[] {
    const host = this.elementRef.nativeElement;
    const list = host.closest('.govuk-tabs')?.querySelector('.govuk-tabs__list');
    return Array.from(list?.querySelectorAll('.govuk-tabs__tab') ?? []);
  }

  /**
   * Moves focus by an offset and activates the target tab.
   */
  private focusTabByOffset(tabs: HTMLAnchorElement[], currentIndex: number, offset: number): void {
    const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
    this.activateTab(tabs[nextIndex]);
  }

  /**
   * Focuses and activates a tab element when available.
   */
  private activateTab(tab: HTMLAnchorElement | undefined): void {
    if (!tab) {
      return;
    }

    tab.focus();
    tab.click();
  }

  @HostBinding('class')
  /**
   * Returns the host class based on active state.
   */
  get hostClass(): string {
    return this.isActive ? 'govuk-tabs__list-item govuk-tabs__list-item--selected' : 'govuk-tabs__list-item';
  }

  /**
   * Resolves the tab item ID, using the tabs prefix when none is provided.
   */
  get resolvedTabItemId(): string {
    if (this.tabItemId) {
      return this.tabItemId;
    }

    const prefix = this.elementRef.nativeElement.closest('.govuk-tabs')?.id ?? 'tab';
    return `${prefix}-${this.tabItemFragment}`;
  }

  /**
   * Indicates whether this tab matches the active fragment.
   */
  get isActive(): boolean {
    return this.activeTabItemFragment === this.tabItemFragment;
  }

  /**
   * Handles the click event of a sub-navigation item.
   * @param event - The click event.
   * @param item - The item string.
   */
  public handleItemClick(event: Event, item: string): void {
    event.preventDefault();
    this.activate(item);
  }

  /**
   * Handles keyboard navigation across tabs.
   */
  public handleKeydown(event: KeyboardEvent): void {
    const tabs = this.getTabs();
    const current = this.tabLink?.nativeElement;
    const currentIndex = current ? tabs.indexOf(current) : -1;

    if (!tabs.length || currentIndex === -1) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.focusTabByOffset(tabs, currentIndex, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusTabByOffset(tabs, currentIndex, 1);
        break;
      case 'Home':
        event.preventDefault();
        this.activateTab(tabs[0]);
        break;
      case 'End':
        event.preventDefault();
        this.activateTab(tabs.at(-1));
        break;
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.activate(this.tabItemFragment);
        break;
      default:
        break;
    }
  }

  /**
   * Moves focus to the tab link element.
   */
  public focus(): void {
    this.tabLink?.nativeElement.focus();
  }

  /**
   * Navigates to the provided fragment.
   */
  public activate(fragment: string): void {
    this.router.navigate(['./'], { relativeTo: this.route, fragment });
  }
}
