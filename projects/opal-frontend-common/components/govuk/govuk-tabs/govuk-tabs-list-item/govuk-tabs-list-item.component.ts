import { ChangeDetectionStrategy, Component, HostBinding, inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'opal-lib-govuk-tabs-list-item, [opal-lib-govuk-tabs-list-item]',
  templateUrl: './govuk-tabs-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsListItemComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) public tabItemId!: string;
  @Input({ required: true }) public tabItemFragment!: string;
  @Input({ required: true }) public tabItemText!: string;
  @Input({ required: true }) public activeTabItemFragment!: string;

  @HostBinding('class')
  get hostClass(): string {
    return this.activeTabItemFragment === this.tabItemFragment
      ? 'govuk-tabs__list-item govuk-tabs__list-item--selected'
      : 'govuk-tabs__list-item';
  }
  @HostBinding('id')
  get hostId(): string {
    return this.tabItemId;
  }

  /**
   * Handles the click event of a sub-navigation item.
   * @param event - The click event.
   * @param item - The item string.
   */
  public handleItemClick(event: Event, item: string): void {
    event.preventDefault();
    this.router.navigate(['./'], { relativeTo: this.route, fragment: item });
  }
}
