import { ChangeDetectionStrategy, Component, HostBinding, Input, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'opal-lib-govuk-tab-list-item, [opal-lib-govuk-tab-list-item]',
  imports: [],
  templateUrl: './govuk-tab-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabListItemComponent {
  private readonly utilService = inject(UtilsService);
  public _tabsListItemId!: string;

  @Input({ required: true }) public tabsId!: string;
  @Input({ required: true }) set tabsListItemId(tabsListItemId: string) {
    this._tabsListItemId = this.utilService.upperCaseFirstLetter(tabsListItemId);
  }

  @Input({ required: true }) public tabListItemHref!: string;
  @Input({ required: true }) public tabListItemName!: string;

  @HostBinding('class') hostClass = 'govuk-tabs__list-item';
  @HostBinding('id') hostId = `${this.tabsId}_${this._tabsListItemId}`;
}
