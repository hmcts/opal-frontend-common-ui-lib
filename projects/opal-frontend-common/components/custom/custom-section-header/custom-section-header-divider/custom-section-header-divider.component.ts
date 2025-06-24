import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-section-header-divider',
  templateUrl: './custom-section-header-divider.component.html',
  styleUrl: './custom-section-header-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionHeaderDividerComponent {
  @Input({ required: false }) dividerColour: string = '#1d70b8';

  @HostBinding('style.backgroundColor') get bg() {
    return this.dividerColour;
  }
}
