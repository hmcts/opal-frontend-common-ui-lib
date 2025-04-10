import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-badge',
  imports: [],
  templateUrl: './moj-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojBadgeComponent {
  @Input({ required: true }) badgeId!: string;
  @Input({ required: false }) badgeClasses!: string;
}
