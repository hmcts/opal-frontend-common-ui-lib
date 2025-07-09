import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information-item-label, [opal-lib-custom-account-information-item-label]',
  templateUrl: './custom-account-information-item-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationItemLabelComponent {
  @HostBinding('class') hostClass = 'govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold govuk-!-margin-0';
}
