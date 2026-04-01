import { TestBed } from '@angular/core/testing';
import { AbstractTabData } from './abstract-tab-data';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { describe, beforeEach, vi, it, expect } from 'vitest';

class TestTabData extends AbstractTabData {}

describe('AbstractTabData', () => {
  let service: TestTabData;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    router = {
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as Router;
    activatedRoute = {
      parent: {} as ActivatedRoute,
      fragment: of('example-tab'),
      snapshot: { fragment: 'example-tab' } as ActivatedRoute['snapshot'],
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        TestTabData,
      ],
    });

    service = TestBed.inject(TestTabData);
  });

  it('should format count with cap correctly', () => {
    expect(service.formatCountWithCap(10, 99)).toBe('10');
    expect(service.formatCountWithCap(100, 99)).toBe('99+');
  });

  it('should navigate and set activeTab on handleTabSwitch', () => {
    service.handleTabSwitch('example-tab');
    expect(service.activeTab).toBe('example-tab');
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRoute.parent,
      fragment: 'example-tab',
    });
  });

  it('should return transformed fetched data from createTabDataStream', async () => {
    const fragment$ = of('tab2');
    const result = service.createTabDataStream(
      fragment$,
      () => ({}),
      () => of({ value: 42 }),
      (data) => data.value.toString(),
    );
    result.subscribe((res) => {
      expect(res).toBe('42');
    });
  });

  it('should return formatted count from createCountStream', async () => {
    const result = service.createCountStream(
      of('tab1'),
      () => ({}),
      () => of({ count: 150 }),
      (data) => data.count,
      (count) => (count > 99 ? '99+' : `${count}`),
    );
    result.subscribe((res) => {
      expect(res).toBe('99+');
    });
  });

  it('should return default formatted count from createCountStream when formatFn is omitted', async () => {
    const result = service.createCountStream(
      of('tab1'),
      () => ({}),
      () => of({ count: 77 }),
      (data) => data.count,
    );
    result.subscribe((res) => {
      expect(res).toBe('77');
    });
  });

  it('should return fragment stream from getFragmentStream()', async () => {
    const fragment$ = service['getFragmentStream']('default-tab', of());
    fragment$.subscribe((tab) => {
      expect(tab).toBe('example-tab');
    });
  });

  it('should execute clearFn when clearCacheOnTabChange is called', async () => {
    const clearFn = vi.fn();
    const fragment$ = of('tab-change');
    service['clearCacheOnTabChange'](fragment$, clearFn).subscribe((tab) => {
      expect(tab).toBe('tab-change');
      expect(clearFn).toHaveBeenCalled();
    });
  });
});

describe('with null snapshot.fragment', () => {
  let localService: TestTabData;
  let router: Router;

  beforeEach(() => {
    router = {
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as Router;
    const localActivatedRoute = {
      parent: {} as ActivatedRoute,
      fragment: of(null),
      snapshot: { fragment: null } as ActivatedRoute['snapshot'],
    } as unknown as ActivatedRoute;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: localActivatedRoute },
        TestTabData,
      ],
    });

    localService = TestBed.inject(TestTabData);
  });

  it('should fall back to defaultTab if snapshot.fragment is null', async () => {
    const fragment$ = localService['getFragmentStream']('fallback-tab', of());
    fragment$.subscribe((tab) => {
      expect(tab).toBe('fallback-tab');
    });
  });
});
