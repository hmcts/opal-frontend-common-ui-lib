import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'opal-lib-govuk-skip-link',
  imports: [],
  templateUrl: './govuk-skip-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSkipLinkComponent {
  private readonly document = inject(DOCUMENT);
  private readonly utilsService = inject(UtilsService);

  @Input() public targetId = 'main-content';
  @Input() public linkText = 'Skip to main content';

  public get href(): string {
    return `${this.document.location?.pathname ?? ''}#${this.targetId}`;
  }

  public onSkipLink(event: Event): void {
    event.preventDefault();
    this.utilsService.focusElementById(this.targetId);
  }
}
