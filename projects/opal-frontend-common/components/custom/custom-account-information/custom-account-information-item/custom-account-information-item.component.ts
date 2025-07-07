import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-account-information-item',
  templateUrl: './custom-account-information-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountInformationItemComponent {
  @Input({ required: false }) itemClasses: string = 'govuk-grid-column-one-third';

  @HostBinding('class')
  get hostClass(): string {
    return this.itemClasses;
  }
}
