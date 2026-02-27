import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { describe, beforeEach, afterAll, it, expect, vi } from 'vitest';

import { AbstractAccountSummaryBaseComponent } from './abstract-account-summary-base.component';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

interface TestHeader {
  id: number;
  title: string;
}

interface TestTab {
  version: string | null;
  value: string;
}

@Component({
  template: '',
  standalone: true,
})
class TestAbstractAccountSummaryBaseComponent extends AbstractAccountSummaryBaseComponent<TestHeader, TestTab> {
  public readonly getHeaderDataFromRouteMock = vi.fn();
  public readonly setupTabDataStreamMock = vi.fn();
  public readonly getHeaderDataMock = vi.fn((accountId: number) => of({ id: accountId, title: 'header' }));
  public readonly transformHeaderForStoreMock = vi.fn();
  public readonly transformHeaderForViewMock = vi.fn((header: TestHeader) => ({
    ...header,
    title: `${header.title}-view`,
  }));

  protected override getHeaderDataFromRoute(): void {
    this.getHeaderDataFromRouteMock();
  }

  protected override getHeaderData(accountId: number): Observable<TestHeader> {
    return this.getHeaderDataMock(accountId);
  }

  protected override transformHeaderForStore(accountId: number, header: TestHeader): void {
    this.transformHeaderForStoreMock(accountId, header);
  }

  protected override transformHeaderForView(header: TestHeader): TestHeader {
    return this.transformHeaderForViewMock(header);
  }

  protected override setupTabDataStream(): void {
    this.setupTabDataStreamMock();
  }

  public callFetchTabData(
    serviceCall: Observable<TestTab>,
    compareVersion: (version: string | null) => void,
  ): Observable<TestTab> {
    return this.fetchTabData(serviceCall, compareVersion);
  }

  public subscribeToRefreshFragment(
    next?: (value: string) => void,
    complete?: () => void,
  ): { unsubscribe: () => void } {
    return this.refreshFragment$.subscribe({ next, complete });
  }
}

describe('AbstractAccountSummaryBaseComponent', () => {
  let component: TestAbstractAccountSummaryBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractAccountSummaryBaseComponent> | null;

  const businessUnitUsers = [{ business_unit_id: 101, permissions: [{ permission_id: 55 }] }];
  const hasPermissionAccessMock = vi.fn();
  const hasBusinessUnitPermissionAccessMock = vi.fn();

  beforeEach(async () => {
    hasPermissionAccessMock.mockReset();
    hasBusinessUnitPermissionAccessMock.mockReset();

    await TestBed.configureTestingModule({
      imports: [TestAbstractAccountSummaryBaseComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {},
            fragment: of(null),
            snapshot: { fragment: null },
          },
        },
        {
          provide: PermissionsService,
          useValue: {
            hasPermissionAccess: hasPermissionAccessMock,
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

    fixture = TestBed.createComponent(TestAbstractAccountSummaryBaseComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call header and tab setup hooks on init', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.ngOnInit();

    expect(component.getHeaderDataFromRouteMock).toHaveBeenCalledTimes(1);
    expect(component.setupTabDataStreamMock).toHaveBeenCalledTimes(1);
  });

  it('should delegate hasPermission to PermissionsService with user business units', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    hasPermissionAccessMock.mockReturnValueOnce(true);

    const result = component.hasPermission(55);

    expect(result).toBe(true);
    expect(hasPermissionAccessMock).toHaveBeenCalledWith(55, businessUnitUsers);
  });

  it('should delegate hasBusinessUnitPermission to PermissionsService with user business units', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    hasBusinessUnitPermissionAccessMock.mockReturnValueOnce(false);

    const result = component.hasBusinessUnitPermission(55, 101);

    expect(result).toBe(false);
    expect(hasBusinessUnitPermissionAccessMock).toHaveBeenCalledWith(55, 101, businessUnitUsers);
  });

  it('should transform tab data, compare versions, and suppress duplicate emissions', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const compareVersion = vi.fn();
    const tabData = { version: 'v1', value: 'same' };
    const results: TestTab[] = [];

    component.callFetchTabData(of(tabData, tabData), compareVersion).subscribe((value) => {
      results.push(value);
    });

    expect(results).toEqual([tabData]);
    expect(compareVersion).toHaveBeenCalledWith('v1');
  });

  it('should stop fetchTabData stream after destroy', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const compareVersion = vi.fn();
    const tabData$ = new Subject<TestTab>();

    component.callFetchTabData(tabData$, compareVersion).subscribe();

    tabData$.next({ version: 'v1', value: 'one' });
    component.ngOnDestroy();
    tabData$.next({ version: 'v2', value: 'two' });

    expect(compareVersion).toHaveBeenCalledTimes(1);
    expect(compareVersion).toHaveBeenCalledWith('v1');
  });

  it('should refresh page, transform/store header, and emit current active tab fragment', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const successSpy = vi.fn();
    const refreshFragmentSpy = vi.fn();

    component.activeTab = 'details';
    component.subscribeToRefreshFragment(refreshFragmentSpy);

    component.refreshPage(88, successSpy);

    expect(component.getHeaderDataMock).toHaveBeenCalledWith(88);
    expect(component.transformHeaderForStoreMock).toHaveBeenCalledWith(88, { id: 88, title: 'header' });
    expect(component.transformHeaderForViewMock).toHaveBeenCalledWith({ id: 88, title: 'header' });
    expect(successSpy).toHaveBeenCalledWith({ id: 88, title: 'header-view' });
    expect(refreshFragmentSpy).toHaveBeenCalledWith('details');
  });

  it('should complete refreshFragment$ on destroy', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const completeSpy = vi.fn();

    component.subscribeToRefreshFragment(undefined, completeSpy);
    component.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
