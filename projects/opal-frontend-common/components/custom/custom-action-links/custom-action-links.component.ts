import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-action-links',
  templateUrl: './custom-action-links.component.html',
})
export class CustomActionLinksComponent {
  @HostBinding('class') class = 'govuk-grid-column-one-third';
}
