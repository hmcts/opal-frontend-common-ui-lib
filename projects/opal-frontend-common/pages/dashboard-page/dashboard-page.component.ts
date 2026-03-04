import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { IDashboardPageConfiguration } from './interfaces/dashboard-page-configuration.interface';
import { RouterModule } from '@angular/router';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { MojInsetTextComponent } from '@hmcts/opal-frontend-common/components/moj/moj-inset-text';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'opal-lib-dashboard-page',
  imports: [RouterModule, MojInsetTextComponent, NgTemplateOutlet],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly permissionService = inject(PermissionsService);
  public readonly globalStore = inject(GlobalStore);
  @Input({ required: true }) public dashboardConfig!: IDashboardPageConfiguration;

  public readonly permissionIds = computed(() =>
    this.permissionService.getUniquePermissions(this.globalStore.userState()),
  );
}
