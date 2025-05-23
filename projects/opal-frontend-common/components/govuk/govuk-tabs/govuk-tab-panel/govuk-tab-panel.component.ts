import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'opal-lib-govuk-tab-panel',
  imports: [],
  templateUrl: './govuk-tab-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabPanelComponent {
  private readonly utilService = inject(UtilsService);
  public _tabsPanelId!: string;

  @Input({ required: true }) public tabsId!: string;
  @Input({ required: true }) set tabsPanelId(tabsPanelId: string) {
    this._tabsPanelId = this.utilService.upperCaseFirstLetter(tabsPanelId);
  }
}
