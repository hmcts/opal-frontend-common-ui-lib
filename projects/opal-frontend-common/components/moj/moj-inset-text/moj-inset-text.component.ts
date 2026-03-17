import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GovukInsetTextComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-inset-text';

@Component({
  selector: 'opal-lib-moj-inset-text',
  imports: [GovukInsetTextComponent],
  templateUrl: './moj-inset-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojInsetTextComponent {
  @Input({ required: true }) public id!: string;
  @Input({ required: false }) public classes: string | null = null;
}
