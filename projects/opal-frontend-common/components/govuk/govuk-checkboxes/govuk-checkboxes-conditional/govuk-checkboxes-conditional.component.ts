import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-checkboxes-conditional, [opal-lib-govuk-checkboxes-conditional]',
  imports: [],
  templateUrl: './govuk-checkboxes-conditional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesConditionalComponent implements OnInit {
  @Input({ required: true }) conditionalId!: string;

  @HostBinding('class') class = 'govuk-checkboxes__conditional';
  @HostBinding('id') id!: string;

  ngOnInit() {
    this.id = `${this.conditionalId}-conditional`;
  }
}
