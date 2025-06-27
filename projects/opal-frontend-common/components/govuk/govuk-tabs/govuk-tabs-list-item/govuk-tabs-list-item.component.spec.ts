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
    component.tabItemText = 'Example';
    component.activeTabItemFragment = 'example';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have item text', () => {
    const element = fixture.nativeElement.querySelector('.govuk-tabs__list-item--selected a');
    expect(element.textContent.trim()).toBe(component.tabItemText);
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
    expect(link.getAttribute('href')).toBe('#');
  });

  it('should not apply selected class when tabItemFragment does not match activeTabItemFragment', () => {
    component.tabItemFragment = 'different';
    component.activeTabItemFragment = 'example';
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-tabs__list-item--selected')).toBeFalse();
    expect(hostElement.classList.contains('govuk-tabs__list-item')).toBeTrue();
  });
});
