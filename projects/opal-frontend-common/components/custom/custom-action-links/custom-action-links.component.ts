import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-action-links',
  imports: [],
  templateUrl: './custom-action-links.component.html',
  styleUrl: './custom-action-links.component.css',
})
export class CustomActionLinksComponent {
  @HostBinding('class') class = 'govuk-grid-column-one-third';
}
