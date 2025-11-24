import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'opal-lib-internal-server-error',
  imports: [CommonModule],
  templateUrl: './internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalServerErrorComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public readonly operationIdDisplay = computed(() => {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state as { operationId?: string } | undefined;
    const persistedState = this.location.getState() as { operationId?: string } | undefined;
    const operationId = navigationState?.operationId ?? persistedState?.operationId;
    return operationId && operationId.trim().length > 0 ? operationId : 'Unavailable';
  });
}
