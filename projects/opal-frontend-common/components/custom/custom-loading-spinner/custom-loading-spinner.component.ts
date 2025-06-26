import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-loading-spinner',
  templateUrl: './custom-loading-spinner.component.html',
  styleUrl: './custom-loading-spinner.component.scss',
})
export class CustomLoadingSpinnerComponent {
  @HostBinding('class') hostclasses = 'hods-loading-spinner';
}
