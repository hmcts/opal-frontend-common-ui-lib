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

  /**
   * Computes the unique permission ids for the current user from the global store.
   */
  public readonly permissionIds = computed(() =>
    this.permissionService.getUniquePermissions(this.globalStore.userState()),
  );

  /**
   * Returns whether a dashboard link is visible for the current user.
   * Empty permission arrays are treated as unrestricted links.
   * @param linkPermissionIds - Permission ids configured for the link.
   */
  private hasLinkPermission(linkPermissionIds: number[]): boolean {
    if (linkPermissionIds.length === 0) {
      return true;
    }

    const userPermissionIds = this.permissionIds();
    return linkPermissionIds.some((permissionId) => userPermissionIds.includes(permissionId));
  }

  /**
   * Returns highlights that the current user is permitted to view.
   */
  public get visibleHighlights(): IDashboardPageConfigurationLink[] {
    return this.dashboardConfig.highlights.filter((highlight) => this.hasLinkPermission(highlight.permissionIds));
  }

  /**
   * Returns groups with links filtered by permissions, excluding empty groups.
   */
  public get visibleGroups(): IDashboardPageConfigurationLinkGroup[] {
    return this.dashboardConfig.groups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => this.hasLinkPermission(link.permissionIds)),
      }))
      .filter((group) => group.links.length > 0);
  }
}
