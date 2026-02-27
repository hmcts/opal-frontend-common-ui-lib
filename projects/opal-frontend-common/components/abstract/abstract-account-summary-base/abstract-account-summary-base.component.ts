
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
@Component({
  template: '',
})
export abstract class AbstractAccountSummaryBaseComponent<THeader>
  extends AbstractTabData
  implements OnInit, OnDestroy
{
  protected readonly destroy$ = new Subject<void>();
  protected readonly refreshFragment$ = new Subject<string>();

  protected readonly permissionsService = inject(PermissionsService);
  protected readonly globalStore = inject(GlobalStore);
  protected readonly userState = this.globalStore.userState();

  public accountData!: THeader;

  // ---- hooks each subclass provides ----
  protected abstract getHeaderDataFromRoute(): void;
  // protected abstract getHeaderData(accountId: number): Observable<THeader>;
  // protected abstract transformHeaderForStore(accountId: number, header: THeader): void;
  // protected setupTabDataStream(): void {
    // Optional: only defendant needs this today
  // }

  /**
   * Checks if the user has access to a specific permission based on their roles and business unit associations.
   * @param permission The numeric value related to the specific permission.
   * @returns A boolean indicating whether the user has the specified permission.
   */
  public hasPermission(permission: number): boolean {
    return this.permissionsService.hasPermissionAccess(
      permission,
      this.userState.business_unit_users,
    );
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshFragment$.complete();
  }
}