import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

interface CreditorDetailsAccountStore {
  account_id(): number | string | null | undefined;
  business_unit_id(): number | string | null | undefined;
  clearSuccessMessage(): void;
  compareVersion(version: string | null): void;
  setHasVersionMismatch(value: boolean): void;
  setSuccessMessage(message: string | null): void;
}

@Component({
  template: '',
})
export abstract class AbstractCreditorDetailsBaseComponent<THeader, TTab extends { version: string | null }>
  extends AbstractAccountSummaryBaseComponent<THeader, TTab>
  implements OnInit, OnDestroy
{
  protected abstract readonly headerDataRouteKey: string;
  protected abstract readonly defaultActiveTab: string;
  protected abstract readonly transformItemsConfig: ITransformItem[];
  protected abstract readonly latestBannerMessage: string;

  public abstract readonly accountStore: CreditorDetailsAccountStore;
  public abstract readonly finesPermissions: Record<string, number>;

  public accountId: number = Number(this.activatedRoute.snapshot.paramMap.get('accountId'));

  /**
   * Fetches tab data through the shared summary cache flow and applies account version comparison.
   * @param serviceCall The typed service call used to retrieve tab data.
   * @returns The tab data observable with the caller's concrete tab type preserved.
   */
  protected fetchTabDataTyped<T extends TTab>(serviceCall: Observable<T>): Observable<T> {
    return this.fetchTabData(serviceCall, (version) => this.accountStore.compareVersion(version)) as Observable<T>;
  }

  /**
   * Reads creditor heading data resolved on the route, transforms it for display and store state,
   * and sets the active tab from the URL fragment.
   */
  protected override getHeaderDataFromRoute(): void {
    const headingData = this.activatedRoute.snapshot.data[this.headerDataRouteKey] as THeader;
    this.accountData = this.transformHeaderForView(headingData);
    this.transformHeaderForStore(this.accountId, this.accountData);
    this.activeTab = this.activatedRoute.snapshot.fragment || this.defaultActiveTab;
  }

  /**
   * Transforms creditor heading data from the API shape into the view shape.
   * @param header The creditor heading data to transform.
   * @returns The transformed creditor heading data for display.
   */
  protected override transformHeaderForView(header: THeader): THeader {
    return this.transformPayload(header, this.transformItemsConfig);
  }

  /**
   * Transforms creditor tab data from the API shape into the view shape.
   * @param data The tab data to transform.
   * @returns The transformed tab data with the original tab type preserved.
   */
  protected override transformTabData<T extends TTab>(data: T): T {
    return this.transformPayload(data, this.transformItemsConfig);
  }

  /**
   * Refreshes the current creditor summary page and updates store state after the latest header is loaded.
   */
  public override refreshPage(): void {
    this.accountStore.setHasVersionMismatch(false);

    super.refreshPage(Number(this.accountStore.account_id()), (header) => {
      this.accountStore.setSuccessMessage(this.latestBannerMessage);
      this.accountData = header;
    });
  }

  /**
   * Checks whether the current user has the requested permission for the active account business unit.
   * @param permissionKey The key used to look up the permission ID.
   * @returns True when the user has the permission for the account business unit.
   */
  public hasBusinessUnitPermissionKey(permissionKey: string): boolean {
    const permission = this.finesPermissions[permissionKey];

    return (
      typeof permission === 'number' &&
      super.hasBusinessUnitPermission(permission, Number(this.accountStore.business_unit_id()!))
    );
  }

  /**
   * Transforms payload data using the consuming application's transformation service and configuration.
   * @param payload The payload to transform.
   * @param transformItemsConfig The consuming application's transform configuration.
   * @returns The transformed payload.
   */
  protected abstract transformPayload<T>(payload: T, transformItemsConfig: ITransformItem[]): T;

  /**
   * Clears transient account summary store flags before the component is destroyed.
   */
  public override ngOnDestroy(): void {
    this.accountStore.clearSuccessMessage();
    this.accountStore.setHasVersionMismatch(false);
    super.ngOnDestroy();
  }
}
