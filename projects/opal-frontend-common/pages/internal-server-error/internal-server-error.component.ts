import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'opal-lib-internal-server-error',
  imports: [],
  templateUrl: './internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalServerErrorComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public readonly operationIdDisplay = computed(() => {
    const queryParamOperationId = this.activatedRoute.snapshot.queryParamMap.get('operationId');
    const navigationState = this.router.currentNavigation()?.extras?.state as { operationId?: string } | undefined;
    const persistedState = this.location.getState() as { operationId?: string } | undefined;
    const operationId = queryParamOperationId ?? navigationState?.operationId ?? persistedState?.operationId;
    return operationId && operationId.trim().length > 0 ? operationId : 'Unavailable';
  });
}
