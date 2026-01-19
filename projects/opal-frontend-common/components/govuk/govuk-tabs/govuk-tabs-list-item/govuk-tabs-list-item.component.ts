import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, inject } from '@angular/core';
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

  @Input({ required: false }) public tabItemId?: string;
  @Input({ required: true }) public tabItemFragment!: string;
  @Input({ required: true }) public activeTabItemFragment!: string;

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
   * Navigates to the provided fragment.
   */
  public activate(fragment: string): void {
    this.router.navigate(['./'], { relativeTo: this.route, fragment });
  }
}
