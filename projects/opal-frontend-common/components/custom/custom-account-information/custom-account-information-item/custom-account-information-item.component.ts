import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information-item',
  templateUrl: './custom-account-information-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationItemComponent {
  @HostBinding('class') hostClass = 'govuk-grid-column-one-fifth';
}
