import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'opal-lib-permission-denied',
  standalone: true,
  imports: [],
  templateUrl: './permission-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDeniedComponent {}
