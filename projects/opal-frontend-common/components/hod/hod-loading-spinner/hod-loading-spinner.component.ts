import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-hod-loading-spinner, [opal-lib-hod-loading-spinner]',
  templateUrl: './hod-loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HodLoadingSpinnerComponent {
  @Input({ required: true }) spinnerId!: string;

  @HostBinding('class') hostClasses = 'hods-loading-spinner';
  @HostBinding('attr.role') role = 'status';
}
