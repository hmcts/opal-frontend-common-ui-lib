import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { IGovukHeaderLinks } from './interfaces/govuk-header-links.interface';
@Component({
  selector: 'opal-lib-govuk-header',
  imports: [RouterLink],
  templateUrl: './govuk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeaderComponent {
  @Input() public headerLinks!: IGovukHeaderLinks;
}
