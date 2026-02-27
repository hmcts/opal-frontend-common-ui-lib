// abstract-account-summary-base.component.ts
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Component({ template: '' })
export abstract class AbstractAccountSummaryBaseComponent<THeader, TTab extends { version: string | null }>
  extends AbstractTabData
  implements OnInit, OnDestroy
{
  protected readonly destroy$ = new Subject<void>();
  protected readonly refreshFragment$ = new Subject<string>();

  protected readonly permissionsService = inject(PermissionsService);
  protected readonly globalStore = inject(GlobalStore);
  protected readonly userState = this.globalStore.userState();

  public accountData!: THeader;

  protected abstract setupTabDataStream(): void;

  // ---- hooks each subclass provides ----
  protected abstract getHeaderDataFromRoute(): void;
  protected abstract getHeaderData(accountId: number): Observable<THeader>;
  protected abstract transformHeaderForStore(accountId: number, header: THeader): void;
  protected abstract transformHeaderForView(header: THeader): THeader;

  /**
   * Fetches tab data and compares its version.
   * @param serviceCall The observable service call to fetch the tab data.
   * @param compareVersion A callback function to compare the version of the fetched data.
   * @returns An observable of the transformed tab data.
   */
  protected fetchTabData(
    serviceCall: Observable<TTab>,
    compareVersion: (version: string | null) => void,
  ): Observable<TTab> {
    return serviceCall.pipe(
      map((data) => this.transformTabData(data)),
      tap((data) => compareVersion(data.version)),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    );
  }

  // Default tab transform just returns input; override if needed.
  protected transformTabData(data: TTab): TTab {
    return data;
  }

  /**
   * Checks if the user has the specified permission.
   * @param permission The permission to check.
   * @returns True if the user has the permission, false otherwise.
   */
  public hasPermission(permission: number): boolean {
    return this.permissionsService.hasPermissionAccess(permission, this.userState.business_unit_users);
  }

  /**
   * Checks if the user has the specified permission for a specific business unit.
   * @param permission The permission to check.
   * @param businessUnitId The ID of the business unit.
   * @returns True if the user has the permission for the business unit, false otherwise.
   */
  public hasBusinessUnitPermission(permission: number, businessUnitId: number): boolean {
    return this.permissionsService.hasBusinessUnitPermissionAccess(
      permission,
      businessUnitId,
      this.userState.business_unit_users,
    );
  }

  /**
   * Refreshes the page with the latest header data.
   * @param accountId The ID of the account.
   * @param onSuccess A callback function to execute on successful data fetch.
   */
  public refreshPage(accountId: number, onSuccess: (header: THeader) => void): void {
    this.getHeaderData(accountId)
      .pipe(
        tap((header) => this.transformHeaderForStore(accountId, header)),
        map((header) => this.transformHeaderForView(header)),
        takeUntil(this.destroy$),
      )
      .subscribe((header) => {
        onSuccess(header);
        this.refreshFragment$.next(this.activeTab);
      });
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();
    this.setupTabDataStream();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshFragment$.complete();
  }
}
