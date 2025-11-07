import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'opal-lib-permission-denied',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDeniedComponent {}
