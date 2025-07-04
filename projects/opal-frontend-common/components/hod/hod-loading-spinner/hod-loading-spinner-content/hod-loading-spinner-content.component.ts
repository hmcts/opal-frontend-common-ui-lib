import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-hod-loading-spinner-content, [opal-lib-hod-loading-spinner-content]',
  templateUrl: './hod-loading-spinner-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HodLoadingSpinnerContentComponent {
  @HostBinding('class') hostClasses = 'hods-loading-spinner__content';
}
