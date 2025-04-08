import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IGovukHeaderLinks } from './interfaces/govuk-header-links.interface';
@Component({
  selector: 'opal-lib-govuk-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeaderComponent {
  @Input() public headerLinks!: IGovukHeaderLinks;
}
