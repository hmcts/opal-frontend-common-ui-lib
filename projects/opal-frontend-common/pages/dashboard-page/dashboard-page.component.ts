import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { IDashboardPageConfiguration } from './interfaces/dashboard-page-configuration.interface';
import { IDashboardPageConfigurationLink } from './interfaces/dashboard-page-configuration-link.interface';
import { IDashboardPageConfigurationLinkGroup } from './interfaces/dashboard-page-configuration-link-group.interface';
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

  /**
   * Returns highlights that the current user is permitted to view.
   */
  public get visibleHighlights(): IDashboardPageConfigurationLink[] {
    const permissionIds = this.permissionIds();
    return this.dashboardConfig.highlights.filter((highlight) => permissionIds.includes(highlight.permissionId));
  }

  /**
   * Returns groups with links filtered by permissions, excluding empty groups.
   */
  public get visibleGroups(): IDashboardPageConfigurationLinkGroup[] {
    const permissionIds = this.permissionIds();
    return this.dashboardConfig.groups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => permissionIds.includes(link.permissionId)),
      }))
      .filter((group) => group.links.length > 0);
  }
}
