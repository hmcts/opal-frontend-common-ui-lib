import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabsComponent } from './govuk-tabs.component';
import { Component } from '@angular/core';
import { addGdsBodyClass } from '../helpers/add-gds-body-class';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GovukTabsListItemComponent } from './govuk-tabs-list-item/govuk-tabs-list-item.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

@Component({
  template: `<opal-lib-govuk-tabs>
    <ng-container tab-list-items><li>Test Tab</li></ng-container>
    <ng-container tab-panels><div class="govuk-tabs__panel">Test Panel</div></ng-container>
  </opal-lib-govuk-tabs>`,
  imports: [GovukTabsComponent],
})
class TestHostComponent {}

@Component({
  template: `<opal-lib-govuk-tabs>
    <ng-container tab-list-items>
      <li opal-lib-govuk-tabs-list-item tabItemFragment="one" [activeTabItemFragment]="active">One</li>
      <li opal-lib-govuk-tabs-list-item tabItemFragment="two" [activeTabItemFragment]="active">Two</li>
      <li opal-lib-govuk-tabs-list-item tabItemFragment="three" [activeTabItemFragment]="active">Three</li>
    </ng-container>
  </opal-lib-govuk-tabs>`,
  imports: [GovukTabsComponent, GovukTabsListItemComponent],
})
class TabsWithItemsHostComponent {
  public active = 'one';
}

@Component({
  template: `<opal-lib-govuk-tabs></opal-lib-govuk-tabs>`,
  imports: [GovukTabsComponent],
})
class TabsEmptyHostComponent {}

describe('GovukTabsComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;
  const fragment$ = new BehaviorSubject<string | null>('test-tab');

  beforeAll(addGdsBodyClass);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { fragment: fragment$.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into list ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-tabs__list');
    expect(element.innerText).toContain('Test Tab');
  });

  it('should render into panels ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-tabs__panel');
    expect(element.innerText).toContain('Test Panel');
  });

  it('should label the tab list with the title', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const title = fixture.nativeElement.querySelector('.govuk-tabs__title');
    const list = fixture.nativeElement.querySelector('.govuk-tabs__list');

    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
  });

  it('should emit activeTabFragmentChange on fragment change', () => {
    const tabsComponent = fixture?.debugElement.children[0].componentInstance as GovukTabsComponent;
    const emitSpy = spyOn(tabsComponent.activeTabFragmentChange, 'emit');

    fragment$.next('companies');

    expect(emitSpy).toHaveBeenCalledWith('companies');
  });

  it('should apply the govuk-frontend-supported class on the root element', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const root = fixture.nativeElement.querySelector('.govuk-tabs');
    expect(root.classList.contains('govuk-frontend-supported')).toBeTrue();
  });

  it('should derive the title id from the tab id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const root = fixture.nativeElement.querySelector('.govuk-tabs');
    const title = fixture.nativeElement.querySelector('.govuk-tabs__title');

    expect(title.getAttribute('id')).toBe(`${root.getAttribute('id')}-title`);
  });
});

describe('GovukTabsComponent focus helpers', () => {
  let fixture: ComponentFixture<TabsWithItemsHostComponent> | null;
  const fragment$ = new BehaviorSubject<string | null>('one');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsWithItemsHostComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { fragment: fragment$.asObservable() },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsWithItemsHostComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should focus and activate the next tab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;
    const nextItem = items[1].componentInstance as GovukTabsListItemComponent;

    const focusSpy = spyOn(nextItem, 'focus');
    const activateSpy = spyOn(nextItem, 'activate');

    tabsComponent.focusNextTab(firstItem);

    expect(focusSpy).toHaveBeenCalled();
    expect(activateSpy).toHaveBeenCalledWith('two');
  });

  it('should focus and activate the previous tab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;
    const lastItem = items[2].componentInstance as GovukTabsListItemComponent;

    const focusSpy = spyOn(lastItem, 'focus');
    const activateSpy = spyOn(lastItem, 'activate');

    tabsComponent.focusPreviousTab(firstItem);

    expect(focusSpy).toHaveBeenCalled();
    expect(activateSpy).toHaveBeenCalledWith('three');
  });

  it('should focus and activate the first tab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    const focusSpy = spyOn(firstItem, 'focus');
    const activateSpy = spyOn(firstItem, 'activate');

    tabsComponent.focusFirstTab();

    expect(focusSpy).toHaveBeenCalled();
    expect(activateSpy).toHaveBeenCalledWith('one');
  });

  it('should focus and activate the last tab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const lastItem = items[2].componentInstance as GovukTabsListItemComponent;

    const focusSpy = spyOn(lastItem, 'focus');
    const activateSpy = spyOn(lastItem, 'activate');

    tabsComponent.focusLastTab();

    expect(focusSpy).toHaveBeenCalled();
    expect(activateSpy).toHaveBeenCalledWith('three');
  });

  it('should return early when the current tab is not in the list', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;
    const focusSpy = spyOn(firstItem, 'focus');
    const activateSpy = spyOn(firstItem, 'activate');

    const foreignFixture = TestBed.createComponent(GovukTabsListItemComponent);
    foreignFixture.componentInstance.tabItemFragment = 'foreign';
    foreignFixture.componentInstance.activeTabItemFragment = 'foreign';
    foreignFixture.detectChanges();

    tabsComponent.focusNextTab(foreignFixture.componentInstance);

    expect(focusSpy).not.toHaveBeenCalled();
    expect(activateSpy).not.toHaveBeenCalled();
  });
});

describe('GovukTabsComponent focus helpers with no tabs', () => {
  let fixture: ComponentFixture<TabsEmptyHostComponent> | null;
  const fragment$ = new BehaviorSubject<string | null>('one');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsEmptyHostComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { fragment: fragment$.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsEmptyHostComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should return early when focusing next tab with no items', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const fakeCurrent = {} as GovukTabsListItemComponent;

    expect(() => tabsComponent.focusNextTab(fakeCurrent)).not.toThrow();
  });

  it('should use an empty tabs list when tabItems is undefined for focusNextTab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const fakeCurrent = {} as GovukTabsListItemComponent;
    (tabsComponent as unknown as { tabItems?: unknown }).tabItems = undefined;

    expect(() => tabsComponent.focusNextTab(fakeCurrent)).not.toThrow();
  });

  it('should use an empty tabs list when tabItems is undefined for focusPreviousTab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    const fakeCurrent = {} as GovukTabsListItemComponent;
    (tabsComponent as unknown as { tabItems?: unknown }).tabItems = undefined;

    expect(() => tabsComponent.focusPreviousTab(fakeCurrent)).not.toThrow();
  });

  it('should return early when focusing the first tab with no items', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;

    expect(() => tabsComponent.focusFirstTab()).not.toThrow();
  });

  it('should use an empty tabs list when tabItems is undefined for focusFirstTab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    (tabsComponent as unknown as { tabItems?: unknown }).tabItems = undefined;

    expect(() => tabsComponent.focusFirstTab()).not.toThrow();
  });

  it('should return early when focusing the last tab with no items', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;

    expect(() => tabsComponent.focusLastTab()).not.toThrow();
  });

  it('should use an empty tabs list when tabItems is undefined for focusLastTab', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const tabsComponent = fixture.debugElement.children[0].componentInstance as GovukTabsComponent;
    (tabsComponent as unknown as { tabItems?: unknown }).tabItems = undefined;

    expect(() => tabsComponent.focusLastTab()).not.toThrow();
  });
});
