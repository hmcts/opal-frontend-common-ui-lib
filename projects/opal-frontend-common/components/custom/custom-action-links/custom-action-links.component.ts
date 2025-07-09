import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-action-links',
  templateUrl: './custom-action-links.component.html',
})
export class CustomActionLinksComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: false }) classSize: string = 'govuk-grid-column-one-third';

  @HostBinding('attr.id') get hostId(): string {
    return this.id;
  }
  @HostBinding('class') get hostClass(): string {
    return this.classSize;
  }
}
