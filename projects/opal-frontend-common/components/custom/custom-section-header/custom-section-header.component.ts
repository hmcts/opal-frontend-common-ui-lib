import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-section-header, [opal-lib-custom-section-header]',
  templateUrl: './custom-section-header.component.html',
  styleUrl: './custom-section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionHeaderComponent {
  @Input({ required: false }) dividerColour: string = '#1d70b8';
  @Input({ required: false }) showDivider: boolean = true;
}
