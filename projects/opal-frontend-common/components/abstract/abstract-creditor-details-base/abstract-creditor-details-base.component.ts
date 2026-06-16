import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';

@Component({
  template: '',
})
export abstract class AbstractCreditorDetailsBaseComponent<THeader, TTab extends { version: string | null }>
  extends AbstractAccountSummaryBaseComponent<THeader, TTab>
  implements OnInit, OnDestroy
{
  protected abstract readonly headerDataRouteKey: string;
  protected abstract readonly defaultActiveTab: string;
  protected abstract readonly latestBannerMessage: string;

  public accountId: number = Number(this.activatedRoute.snapshot.paramMap.get('accountId'));

  /**
   * Fetches tab data through the shared summary cache flow and applies account version comparison.
   * @param serviceCall The typed service call used to retrieve tab data.
   * @returns The tab data observable with the caller's concrete tab type preserved.
   */
  protected fetchTabDataTyped<T extends TTab>(serviceCall: Observable<T>): Observable<T> {
    return this.fetchTabData(serviceCall, (version) => this.compareVersion(version)) as Observable<T>;
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
    return this.transformPayload(header);
  }

  /**
   * Transforms creditor tab data from the API shape into the view shape.
   * @param data The tab data to transform.
   * @returns The transformed tab data with the original tab type preserved.
   */
  protected override transformTabData<T extends TTab>(data: T): T {
    return this.transformPayload(data);
  }

  /**
   * Refreshes the current creditor summary page and updates store state after the latest header is loaded.
   */
  public override refreshPage(): void {
    this.setHasVersionMismatch(false);

    super.refreshPage(this.getRefreshAccountId(), (header) => {
      this.setSuccessMessage(this.latestBannerMessage);
      this.accountData = header;
    });
  }

  /**
   * Checks whether the current user has the requested permission for the active account business unit.
   * @param permissionKey The key used to look up the permission ID.
   * @returns True when the user has the permission for the account business unit.
   */
  public hasBusinessUnitPermissionKey(permissionKey: string): boolean {
    const permission = this.getPermission(permissionKey);

    return typeof permission === 'number' && super.hasBusinessUnitPermission(permission, this.getBusinessUnitId());
  }

  protected abstract getPermission(permissionKey: string): number | undefined;

  protected abstract compareVersion(version: string | null): void;

  protected abstract getBusinessUnitId(): number;

  protected abstract getRefreshAccountId(): number;

  protected abstract setHasVersionMismatch(value: boolean): void;

  protected abstract setSuccessMessage(message: string | null): void;

  protected abstract clearSuccessMessage(): void;

  /**
   * Transforms payload data using the consuming application's transformation service and configuration.
   * @param payload The payload to transform.
   * @returns The transformed payload.
   */
  protected abstract transformPayload<T>(payload: T): T;

  /**
   * Clears transient account summary store flags before the component is destroyed.
   */
  public override ngOnDestroy(): void {
    this.clearSuccessMessage();
    this.setHasVersionMismatch(false);
    super.ngOnDestroy();
  }
}
