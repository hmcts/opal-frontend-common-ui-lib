import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTabsListItemComponent } from './govuk-tabs-list-item.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div class="govuk-tabs" id="test-tabs">
      <ul class="govuk-tabs__list">
        <li opal-lib-govuk-tabs-list-item tabItemFragment="one" [activeTabItemFragment]="active">One</li>
        <li opal-lib-govuk-tabs-list-item tabItemFragment="two" [activeTabItemFragment]="active">Two</li>
      </ul>
    </div>
  `,
  imports: [GovukTabsListItemComponent],
})
class TabsListItemHostComponent {
  public active = 'one';
}

describe('GovukTabsListItemComponent', () => {
  let component: GovukTabsListItemComponent;
  let fixture: ComponentFixture<GovukTabsListItemComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabsListItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTabsListItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.tabItemId = 'example';
    component.tabItemFragment = 'example';
    component.activeTabItemFragment = 'example';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be an active link', () => {
    component.tabItemFragment = 'example';
    component.activeTabItemFragment = 'example';
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-tabs__list-item--selected')).toBeTrue();
  });

  it('should not be an active link', () => {
    component.activeTabItemFragment = 'not-example';
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const element = fixture.nativeElement.querySelector('.govuk-tabs__list-item--selected');
    expect(element).toBeFalsy();
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const navigateSpy = spyOn(router, 'navigate');

    component.handleItemClick(event, component.tabItemFragment);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: component.tabItemFragment,
    });
  });

  it('should include href attribute', () => {
    const link = fixture.nativeElement.querySelector('.govuk-tabs__list-item a.govuk-tabs__tab');
    expect(link.getAttribute('href')).toBe('#example');
  });

  it('should set aria-selected and tabindex based on active state', () => {
    const link = fixture.nativeElement.querySelector('.govuk-tabs__list-item a.govuk-tabs__tab');
    expect(link.getAttribute('aria-selected')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('0');

    fixture.componentRef.setInput('activeTabItemFragment', 'different');
    fixture.detectChanges();

    const inactiveLink = fixture.nativeElement.querySelector('.govuk-tabs__list-item a.govuk-tabs__tab');
    expect(inactiveLink.getAttribute('aria-selected')).toBe('false');
    expect(inactiveLink.getAttribute('tabindex')).toBe('-1');
  });

  it('should not apply selected class when tabItemFragment does not match activeTabItemFragment', () => {
    component.tabItemFragment = 'different';
    component.activeTabItemFragment = 'example';
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-tabs__list-item--selected')).toBeFalse();
    expect(hostElement.classList.contains('govuk-tabs__list-item')).toBeTrue();
  });

  it('should default the resolved tab id to the tab prefix when no container id is present', () => {
    component.tabItemId = undefined;
    component.tabItemFragment = 'alpha';
    fixture.detectChanges();

    expect(component.resolvedTabItemId).toBe('tab-alpha');
  });

  it('should return early on keydown when no tabs list is available', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should return early on keydown when the current tab is not in the list', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const otherTab = document.createElement('a');
    otherTab.className = 'govuk-tabs__tab';
    spyOn(component as unknown as { getTabs: () => HTMLAnchorElement[] }, 'getTabs').and.returnValue([otherTab]);

    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should return early on keydown when no current tab element is available', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const otherTab = document.createElement('a');
    otherTab.className = 'govuk-tabs__tab';
    spyOn(component as unknown as { getTabs: () => HTMLAnchorElement[] }, 'getTabs').and.returnValue([otherTab]);
    Object.defineProperty(component as unknown as object, 'tabLink', { value: undefined, writable: true });

    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should no-op when activating an undefined tab', () => {
    expect(() =>
      (component as unknown as { activateTab: (tab?: HTMLAnchorElement) => void }).activateTab(undefined),
    ).not.toThrow();
  });

  it('should focus the tab link when focus() is called', () => {
    const link = fixture.nativeElement.querySelector('.govuk-tabs__tab') as HTMLAnchorElement;
    const focusSpy = spyOn(link, 'focus');

    component.focus();

    expect(focusSpy).toHaveBeenCalled();
  });
});

describe('GovukTabsListItemComponent keyboard navigation', () => {
  let fixture: ComponentFixture<TabsListItemHostComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsListItemHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsListItemHostComponent);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should resolve tab ids using the tabs container id', () => {
    const anchors = fixture.nativeElement.querySelectorAll('.govuk-tabs__tab') as NodeListOf<HTMLAnchorElement>;
    expect(anchors[0].id).toBe('test-tabs-one');
    expect(anchors[1].id).toBe('test-tabs-two');
  });

  it('should activate the next tab on ArrowRight', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    firstItem.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(navigateSpy).toHaveBeenCalledWith(['./'], { relativeTo: route, fragment: 'two' });
  });

  it('should activate the previous tab on ArrowLeft', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    firstItem.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(navigateSpy).toHaveBeenCalledWith(['./'], { relativeTo: route, fragment: 'two' });
  });

  it('should activate the first tab on Home', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const secondItem = items[1].componentInstance as GovukTabsListItemComponent;

    secondItem.handleKeydown(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(navigateSpy).toHaveBeenCalledWith(['./'], { relativeTo: route, fragment: 'one' });
  });

  it('should activate the last tab on End', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    firstItem.handleKeydown(new KeyboardEvent('keydown', { key: 'End' }));

    expect(navigateSpy).toHaveBeenCalledWith(['./'], { relativeTo: route, fragment: 'two' });
  });

  it('should activate the current tab on Space', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    firstItem.handleKeydown(new KeyboardEvent('keydown', { key: ' ' }));

    expect(navigateSpy).toHaveBeenCalledWith(['./'], { relativeTo: route, fragment: 'one' });
  });

  it('should ignore unhandled keys', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const items = fixture.debugElement.queryAll(By.directive(GovukTabsListItemComponent));
    const firstItem = items[0].componentInstance as GovukTabsListItemComponent;

    firstItem.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
