import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGovukFooterLinks } from './interfaces/govuk-footer-links.interface';

@Component({
  selector: 'opal-lib-govuk-footer',
  imports: [CommonModule],
  templateUrl: './govuk-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukFooterComponent {
  @Input() public footerLinks!: IGovukFooterLinks;
}
