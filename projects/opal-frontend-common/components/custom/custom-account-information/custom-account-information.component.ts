import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information, [opal-lib-custom-account-information]',
  templateUrl: './custom-account-information.component.html',
  styleUrl: './custom-account-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationComponent {
  @HostBinding('class') hostClass = 'govuk-grid-row';
}
