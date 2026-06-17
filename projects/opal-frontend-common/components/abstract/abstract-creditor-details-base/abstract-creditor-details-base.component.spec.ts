import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AbstractCreditorDetailsBaseComponent } from './abstract-creditor-details-base.component';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

interface TestHeader {
  version: string | null;
  name: string;
}

interface TestTabData {
  version: string | null;
  status: string;
}

const routeHeaderData: TestHeader = { version: '1', name: 'Route header' };
const transformedRouteHeaderData: TestHeader = { version: '1', name: 'Transformed route header' };
const refreshedHeaderData: TestHeader = { version: '2', name: 'Refreshed header' };
const transformedRefreshedHeaderData: TestHeader = { version: '2', name: 'Transformed refreshed header' };
const transformItemsConfig: ITransformItem[] = [];
const latestBannerMessage = 'Latest account data loaded';
const defaultActiveTab = 'at-a-glance';

@Component({
  template: '',
  standalone: true,
})
class TestAbstractCreditorDetailsBaseComponent extends AbstractCreditorDetailsBaseComponent<TestHeader, TestTabData> {
  protected override readonly headerDataRouteKey = 'testHeaderData';
  protected override readonly defaultActiveTab = defaultActiveTab;
  protected override readonly transformItemsConfig = transformItemsConfig;
  protected override readonly latestBannerMessage = latestBannerMessage;

  protected override readonly payloadTransformer = {
    transformPayload: <T extends { [key: string]: unknown }>(payload: T, transformItemsConfig: ITransformItem[]): T => {
      return this.transformPayloadMock(payload, transformItemsConfig) as T;
    },
  };

  protected override readonly permissions: Record<string, number> = {
    'account-maintenance': 101,
  };

  public override readonly accountStore = {
    account_id: vi.fn(() => 456),
    business_unit_id: vi.fn(() => '77'),
    clearSuccessMessage: vi.fn(),
    compareVersion: vi.fn(),
    setHasVersionMismatch: vi.fn(),
    setSuccessMessage: vi.fn(),
  };

  public readonly storeTransformCalls: Array<{ accountId: number; header: TestHeader }> = [];
  public readonly getHeaderDataMock = vi.fn((accountId: number) => {
    void accountId;
    return of(refreshedHeaderData);
  });
  public readonly setupTabDataStreamMock = vi.fn();
  public readonly transformPayloadMock = vi.fn((payload: unknown, transformItemsConfig: ITransformItem[]): unknown => {
    void transformItemsConfig;

    if (payload === routeHeaderData) {
      return transformedRouteHeaderData;
    }

    if (payload === refreshedHeaderData) {
      return transformedRefreshedHeaderData;
    }

    return payload;
  });

  protected override setupTabDataStream(): void {
    this.setupTabDataStreamMock();
  }

  protected override getHeaderData(accountId: number): Observable<TestHeader> {
    return this.getHeaderDataMock(accountId);
  }

  protected override transformHeaderForStore(accountId: number, header: TestHeader): void {
    this.storeTransformCalls.push({ accountId, header });
  }

  public callGetHeaderDataFromRoute(): void {
    this.getHeaderDataFromRoute();
  }

  public callFetchTabDataTyped(tabData: TestTabData): Observable<TestTabData> {
    return this.fetchTabDataTyped(of(tabData));
  }

  public callTransformTabData<T extends TestTabData>(tabData: T): T {
    return this.transformTabData(tabData);
  }
}

describe('AbstractCreditorDetailsBaseComponent', () => {
  let component: TestAbstractCreditorDetailsBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractCreditorDetailsBaseComponent> | null;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let hasBusinessUnitPermissionAccessMock: ReturnType<typeof vi.fn>;

  const businessUnitUsers = [{ business_unit_id: 77, permissions: [{ permission_id: 101 }] }];

  beforeEach(async () => {
    hasBusinessUnitPermissionAccessMock = vi.fn();

    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          testHeaderData: routeHeaderData,
        },
        fragment: 'account-tab',
        paramMap: convertToParamMap({ accountId: '123' }),
      } as unknown as ActivatedRouteSnapshot,
    };

    await TestBed.configureTestingModule({
      imports: [TestAbstractCreditorDetailsBaseComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn(), createUrlTree: vi.fn(), serializeUrl: vi.fn() } },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: PermissionsService,
          useValue: {
            hasPermissionAccess: vi.fn(),
            hasBusinessUnitPermissionAccess: hasBusinessUnitPermissionAccessMock,
          },
        },
        {
          provide: GlobalStore,
          useValue: {
            userState: () => ({ business_unit_users: businessUnitUsers }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAbstractCreditorDetailsBaseComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create with route-derived defaults', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    expect(component).toBeTruthy();
    expect(component.accountId).toBe(123);
  });

  it('should initialize header data, store state and active tab from route data', () => {
    if (!component || !fixture) {
      throw new Error('component returned null');
    }

    fixture.detectChanges();

    expect(component.accountData).toEqual(transformedRouteHeaderData);
    expect(component.activeTab).toBe('account-tab');
    expect(component.storeTransformCalls).toEqual([{ accountId: 123, header: transformedRouteHeaderData }]);
    expect(component.setupTabDataStreamMock).toHaveBeenCalledTimes(1);
    expect(component.transformPayloadMock).toHaveBeenCalledWith(routeHeaderData, transformItemsConfig);
  });

  it('should default the active tab to at-a-glance when the route has no fragment', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.fragment = null;

    component.callGetHeaderDataFromRoute();

    expect(component.activeTab).toBe(defaultActiveTab);
  });

  it('should transform tab data and compare the returned version', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const tabData: TestTabData = { version: '3', status: 'ready' };

    component.callFetchTabDataTyped(tabData).subscribe((result) => {
      expect(result).toEqual(tabData);
    });

    expect(component.transformPayloadMock).toHaveBeenCalledWith(tabData, transformItemsConfig);
    expect(component.accountStore.compareVersion).toHaveBeenCalledWith(tabData.version);
  });

  it('should delegate direct tab transforms to the supplied payload transformer', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const tabData: TestTabData = { version: '4', status: 'updated' };

    const result = component.callTransformTabData(tabData);

    expect(result).toEqual(tabData);
    expect(component.transformPayloadMock).toHaveBeenCalledWith(tabData, transformItemsConfig);
  });

  it('should refresh header data and set the latest banner message', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.refreshPage();

    expect(component.accountStore.setHasVersionMismatch).toHaveBeenCalledWith(false);
    expect(component.getHeaderDataMock).toHaveBeenCalledWith(456);
    expect(component.storeTransformCalls).toContainEqual({ accountId: 456, header: refreshedHeaderData });
    expect(component.accountStore.setSuccessMessage).toHaveBeenCalledWith(latestBannerMessage);
    expect(component.accountData).toEqual(transformedRefreshedHeaderData);
  });

  it('should check business unit permissions against the account store business unit', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    hasBusinessUnitPermissionAccessMock.mockReturnValue(true);

    const result = component.hasBusinessUnitPermissionKey('account-maintenance');

    expect(result).toBe(true);
    expect(hasBusinessUnitPermissionAccessMock).toHaveBeenCalledWith(101, 77, businessUnitUsers);
  });

  it('should return false when a business unit permission key is unknown', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const result = component.hasBusinessUnitPermissionKey('missing-permission');

    expect(result).toBe(false);
    expect(hasBusinessUnitPermissionAccessMock).not.toHaveBeenCalled();
  });

  it('should clear transient account state on destroy', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.ngOnDestroy();

    expect(component.accountStore.clearSuccessMessage).toHaveBeenCalled();
    expect(component.accountStore.setHasVersionMismatch).toHaveBeenCalledWith(false);
  });
});
