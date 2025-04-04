import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-task-list',
  imports: [],
  templateUrl: './govuk-task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTaskListComponent {
  @Input({ required: true }) taskListId!: string;
  @Input({ required: false }) taskListClasses!: string;
}
