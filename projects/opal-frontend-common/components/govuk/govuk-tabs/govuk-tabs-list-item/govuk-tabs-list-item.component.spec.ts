import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTabsListItemComponent } from './govuk-tabs-list-item.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

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
    expect(link.getAttribute('role')).toBe('tab');

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
});
