import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information-item-label, [opal-lib-custom-account-information-item-label]',
  templateUrl: './custom-account-information-item-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationItemLabelComponent {
  @HostBinding('class') hostClass = 'govuk-heading-s govuk-!-margin-0';
}
