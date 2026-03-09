import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojPrimaryNavigationItemComponent } from './moj-primary-navigation-item.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojPrimaryNavigationItemComponent', () => {
  let component: MojPrimaryNavigationItemComponent;
  let fixture: ComponentFixture<MojPrimaryNavigationItemComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPrimaryNavigationItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPrimaryNavigationItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.primaryNavigationItemId = 'example';
    component.primaryNavigationItemFragment = 'example';
    component.primaryNavigationItemText = 'Example';
    component.activeItemFragment = 'example';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have item text', () => {
    const element = fixture.nativeElement.querySelector('.moj-primary-navigation__link');
    expect(element.textContent?.trim()).toBe(component.primaryNavigationItemText);
  });

  it('should be an active link', () => {
    const element = fixture.nativeElement.querySelector('.moj-primary-navigation__link').getAttribute('aria-current');

    expect(element).toBe('page');
  });

  it('should not be an active link', () => {
    component.activeItemFragment = 'not-example';
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const element = fixture.nativeElement.querySelector('.moj-primary-navigation__link');

    expect(element).not.toBe('page');
  });

  it('should navigate to the correct route with fragment', () => {
    const event = new Event('click');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.handleItemClick(event, component.primaryNavigationItemFragment);

    expect(navigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      fragment: component.primaryNavigationItemFragment,
    });
  });

  it('should emit the selected item in path-driven mode', () => {
    const event = new Event('click');
    const navigateSpy = vi.spyOn(router, 'navigate');
    const selectedSpy = vi.spyOn(component.navigationItemSelected, 'emit');
    component.useFragmentNavigation = false;

    component.handleItemClick(event, component.primaryNavigationItemFragment);

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(selectedSpy).toHaveBeenCalledWith(component.primaryNavigationItemFragment);
  });

  it('should only emit once when Enter keyup is followed by click in path-driven mode', () => {
    const selectedSpy = vi.spyOn(component.navigationItemSelected, 'emit');
    component.useFragmentNavigation = false;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.moj-primary-navigation__link');
    element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(selectedSpy).toHaveBeenCalledTimes(1);
    expect(selectedSpy).toHaveBeenCalledWith(component.primaryNavigationItemFragment);
  });
});
