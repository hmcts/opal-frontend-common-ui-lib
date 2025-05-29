import { TestBed } from '@angular/core/testing';
import { AbstractTabData } from './abstract-tab-data';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class TestTabData extends AbstractTabData {}

describe('AbstractTabData', () => {
  let service: TestTabData;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      parent: {},
      fragment: of('example-tab'),
      snapshot: { fragment: 'example-tab' },
    });

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

  it('should return transformed fetched data from createTabDataStream', (done) => {
    const fragment$ = of('tab2');
    const result = service.createTabDataStream(
      fragment$,
      () => ({}),
      () => of({ value: 42 }),
      (data) => data.value.toString(),
    );
    result.subscribe((res) => {
      expect(res).toBe('42');
      done();
    });
  });

  it('should return formatted count from createCountStream', (done) => {
    const result = service.createCountStream(
      of('tab1'),
      () => ({}),
      () => of({ count: 150 }),
      (data) => data.count,
      (count) => (count > 99 ? '99+' : `${count}`),
    );
    result.subscribe((res) => {
      expect(res).toBe('99+');
      done();
    });
  });

  it('should return default formatted count from createCountStream when formatFn is omitted', (done) => {
    const result = service.createCountStream(
      of('tab1'),
      () => ({}),
      () => of({ count: 77 }),
      (data) => data.count,
    );
    result.subscribe((res) => {
      expect(res).toBe('77');
      done();
    });
  });

  it('should return fragment stream from getFragmentStream()', (done) => {
    const fragment$ = service['getFragmentStream']('default-tab', of());
    fragment$.subscribe((tab) => {
      expect(tab).toBe('example-tab');
      done();
    });
  });

  it('should execute clearFn when clearCacheOnTabChange is called', (done) => {
    const clearFn = jasmine.createSpy();
    const fragment$ = of('tab-change');
    service['clearCacheOnTabChange'](fragment$, clearFn).subscribe((tab) => {
      expect(tab).toBe('tab-change');
      expect(clearFn).toHaveBeenCalled();
      done();
    });
  });
});

describe('with null snapshot.fragment', () => {
  let localService: TestTabData;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    const localActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      parent: {},
      fragment: of(null),
      snapshot: { fragment: null },
    });

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

  it('should fall back to defaultTab if snapshot.fragment is null', (done) => {
    const fragment$ = localService['getFragmentStream']('fallback-tab', of());
    fragment$.subscribe((tab) => {
      expect(tab).toBe('fallback-tab');
      done();
    });
  });
});
