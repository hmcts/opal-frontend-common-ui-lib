import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojSubNavigationItemComponent } from './moj-sub-navigation-item.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojSubNavigationItemComponent', () => {
  let component: MojSubNavigationItemComponent;
  let fixture: ComponentFixture<MojSubNavigationItemComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.subNavItemId = 'example';
    component.subNavItemFragment = 'example';
    component.subNavItemText = 'Example';
    component.activeSubNavItemFragment = 'example';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have item text', () => {
    const element = fixture.nativeElement.querySelector('.moj-sub-navigation__link');
    expect(element.textContent?.trim()).toBe(component.subNavItemText);
  });

  it('should be an active link', () => {
    const element = fixture.nativeElement.querySelector('.moj-sub-navigation__link').getAttribute('aria-current');

    expect(element).toBe('page');
  });

  it('should not be an active link', () => {
    component.activeSubNavItemFragment = 'not-example';
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const element = fixture.nativeElement.querySelector('.moj-sub-navigation__link');

    expect(element).not.toBe('page');
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.handleItemClick(event, component.subNavItemFragment);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: component.subNavItemFragment,
    });
  });

  it('should include href attribute', () => {
    const element = fixture.nativeElement.querySelector('.moj-sub-navigation__link');
    expect(element.getAttribute('href')).toBe('#');
  });
});
