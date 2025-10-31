import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Component({
  selector: 'opal-lib-internal-server-error',
  imports: [CommonModule],
  templateUrl: './internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalServerErrorComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);

  public readonly errorState = computed(() => this.globalStore.error());

  public readonly operationIdDisplay = computed(() => {
    const operationId = this.errorState().operationId;
    return operationId && operationId.trim().length > 0 ? operationId : 'Unavailable';
  });

  public ngOnDestroy(): void {
    this.globalStore.resetError();
  }
}
