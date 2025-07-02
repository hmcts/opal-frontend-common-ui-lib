import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-hod-loading-spinner-text,[opal-lib-hod-loading-spinner-text]',
  templateUrl: './hod-loading-spinner-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HodLoadingSpinnerTextComponent {
  @HostBinding('class') hostClasses = 'govuk-!-margin-0';
}
