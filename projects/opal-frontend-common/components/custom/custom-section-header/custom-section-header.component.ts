import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-section-header, [opal-lib-custom-section-header]',
  imports: [],
  templateUrl: './custom-section-header.component.html',
  styleUrl: './custom-section-header.component.css',
})
export class CustomSectionHeaderComponent {
  @Input({ required: true }) customSectionHeading!: string;
}
