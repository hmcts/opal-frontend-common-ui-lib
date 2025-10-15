import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingLevel } from '@hmcts/opal-frontend-common/types';

@Component({
  selector: 'opal-lib-govuk-heading-with-caption',
  imports: [CommonModule],
  templateUrl: './govuk-heading-with-caption.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeadingWithCaptionComponent {
  @Input({ required: true }) captionText!: string;
  @Input({ required: true }) headingText!: string;
  @Input({ required: false }) headingClasses: string = 'govuk-heading-l';
  @Input({ required: false }) captionClasses: string = 'govuk-caption-l';
  @Input({ required: false }) headingLevel: HeadingLevel = 1;
}
