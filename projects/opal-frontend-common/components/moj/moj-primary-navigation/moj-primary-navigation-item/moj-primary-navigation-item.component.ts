import { ChangeDetectionStrategy, Component, HostBinding, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'opal-lib-moj-primary-navigation-item, [opal-lib-moj-primary-navigation-item]',
  imports: [],
  templateUrl: './moj-primary-navigation-item.component.html',
  styleUrls: ['./moj-primary-navigation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPrimaryNavigationItemComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) public primaryNavigationItemId!: string;
  @Input({ required: true }) public primaryNavigationItemFragment!: string;
  @Input({ required: true }) public primaryNavigationItemText!: string;
  @Input({ required: true }) public activeItemFragment!: string;
  @Input({ required: false }) public isLastItem: boolean = false;

  @HostBinding('class') hostClass = 'moj-primary-navigation__item';
  @HostBinding('id') hostId = `${this.primaryNavigationItemId}`;
  @HostBinding('class.last-item') hostLastItem = this.isLastItem;

  /**
   * Handles the click event of a sub-navigation item.
   * @param event - The click event.
   * @param item - The item string.
   */
  public handleItemClick(event: Event, item: string): void {
    event.preventDefault();
    // Basically we want to mimic the behaviour of the GDS tabs component, as this is how these will be used.
    this.router.navigate(['./'], { relativeTo: this.route, fragment: item });
  }
}
