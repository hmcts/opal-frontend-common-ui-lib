import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-notification-badge',
  standalone: true,
  imports: [],
  templateUrl: './moj-notification-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojNotificationBadgeComponent {
  @Input({ required: true }) badgeId!: string;
}
