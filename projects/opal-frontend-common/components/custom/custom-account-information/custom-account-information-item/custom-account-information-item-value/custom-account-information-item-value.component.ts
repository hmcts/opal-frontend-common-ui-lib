import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information-item-value, [opal-lib-custom-account-information-item-value]',
  templateUrl: './custom-account-information-item-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationItemValueComponent {
  @HostBinding('class') hostClass = 'govuk-body govuk-!-font-size-16 govuk-!-margin-0';
}
