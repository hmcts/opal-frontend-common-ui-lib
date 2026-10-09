import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HeadingLevel } from '@hmcts/opal-frontend-common/types';

@Component({
  selector: 'opal-lib-moj-timeline-item',
  imports: [NgTemplateOutlet],
  templateUrl: './moj-timeline-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTimelineItemComponent {
  @Input({ required: false }) public headingLevel: HeadingLevel = 2;
}
