import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GovukPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-panel';

@Component({
  selector: 'opal-lib-account-created',
  imports: [GovukPanelComponent],
  templateUrl: './account-created.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCreated {}
