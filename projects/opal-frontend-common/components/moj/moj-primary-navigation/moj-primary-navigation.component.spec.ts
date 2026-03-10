import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, SimpleChange } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { MojPrimaryNavigationComponent } from './moj-primary-navigation.component';
import { MojPrimaryNavigationItemComponent } from './moj-primary-navigation-item/moj-primary-navigation-item.component';

@Component({
  standalone: true,
  imports: [MojPrimaryNavigationComponent, MojPrimaryNavigationItemComponent],
  template: `
    <opal-lib-moj-primary-navigation
      [primaryNavigationId]="primaryNavigationId"
      [useFragmentNavigation]="useFragmentNavigation"
      (activeItemFragment)="handleActiveFragment($event)"
      (navigationItemSelected)="handleNavigationItemSelected($event)"
    >
      <li
        opal-lib-moj-primary-navigation-item
        primaryNavigationItemId="search-link"
        primaryNavigationItemFragment="search"
        [activeItemFragment]="activeItemFragment"
        primaryNavigationItemText="Search"
      ></li>
    </opal-lib-moj-primary-navigation>
  `,
})
class TestHostComponent {
  public primaryNavigationId = 'testPrimaryNavigation';
  public useFragmentNavigation = true;
  public activeItemFragment = 'search';
  public emittedFragments: string[] = [];
  public selectedItems: string[] = [];

  public handleActiveFragment(fragment: string): void {
    this.emittedFragments.push(fragment);
    this.activeItemFragment = fragment;
  }

  public handleNavigationItemSelected(item: string): void {
    this.selectedItems.push(item);
    this.activeItemFragment = item;
  }
}

describe('MojPrimaryNavigationComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let router: Router;
  let fragmentSubject: Subject<string | null>;
  let routeSnapshotFragment: string | null;

  beforeEach(async () => {
    fragmentSubject = new Subject<string | null>();
    routeSnapshotFragment = null;

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragmentSubject.asObservable(),
            get snapshot() {
              return { fragment: routeSnapshotFragment };
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the primary navigation id', () => {
    const element = fixture.nativeElement.querySelector('#testPrimaryNavigation');
    expect(element).toBeTruthy();
  });

  it('should emit fragment updates in fragment mode (default)', () => {
    fragmentSubject.next('accounts');
    fixture.detectChanges();

    expect(component.emittedFragments).toEqual(['accounts']);
  });

  it('should not emit fragment updates in path-driven mode', () => {
    const pathFixture = TestBed.createComponent(TestHostComponent);
    const pathComponent = pathFixture.componentInstance;
    pathComponent.useFragmentNavigation = false;
    pathFixture.detectChanges();

    fragmentSubject.next('individuals');
    pathFixture.detectChanges();

    expect(pathComponent.emittedFragments).toEqual([]);
  });

  it('should emit selected item in path-driven mode and avoid fragment navigation', () => {
    const pathFixture = TestBed.createComponent(TestHostComponent);
    const pathComponent = pathFixture.componentInstance;
    const navigateSpy = vi.spyOn(router, 'navigate');
    pathComponent.useFragmentNavigation = false;
    pathFixture.detectChanges();

    const element = pathFixture.nativeElement.querySelector('.moj-primary-navigation__link');
    element.click();
    pathFixture.detectChanges();

    expect(pathComponent.selectedItems).toEqual(['search']);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should support active styling updates in path-driven mode from selected item', () => {
    const pathFixture = TestBed.createComponent(TestHostComponent);
    const pathComponent = pathFixture.componentInstance;
    pathComponent.useFragmentNavigation = false;
    pathComponent.activeItemFragment = 'accounts';
    pathFixture.detectChanges();

    const element = pathFixture.nativeElement.querySelector('.moj-primary-navigation__link');
    expect(element.getAttribute('aria-current')).toBeNull();

    element.click();
    pathFixture.detectChanges();

    expect(element.getAttribute('aria-current')).toBe('page');
  });

  it('should rewire projected items when useFragmentNavigation changes after initial render', () => {
    const primaryNavigationDebugElement = fixture.debugElement.query(By.directive(MojPrimaryNavigationComponent));
    const primaryNavigationItemDebugElement = fixture.debugElement.query(
      By.directive(MojPrimaryNavigationItemComponent),
    );
    const primaryNavigationComponent = primaryNavigationDebugElement.componentInstance as MojPrimaryNavigationComponent;
    const primaryNavigationItemComponent =
      primaryNavigationItemDebugElement.componentInstance as MojPrimaryNavigationItemComponent;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingSubscription = (primaryNavigationComponent as any).itemSubscriptions[0];
    const unsubscribeSpy = vi.spyOn(existingSubscription, 'unsubscribe');

    primaryNavigationComponent.useFragmentNavigation = false;
    primaryNavigationComponent.ngOnChanges({
      useFragmentNavigation: new SimpleChange(true, false, false),
    });

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(primaryNavigationItemComponent.useFragmentNavigation).toBe(false);
  });

  it('should emit current snapshot fragment when fragment mode is re-enabled', () => {
    const pathFixture = TestBed.createComponent(TestHostComponent);
    const pathComponent = pathFixture.componentInstance;
    pathComponent.useFragmentNavigation = false;
    routeSnapshotFragment = 'individuals';
    pathFixture.detectChanges();

    const primaryNavigationDebugElement = pathFixture.debugElement.query(By.directive(MojPrimaryNavigationComponent));
    const primaryNavigationComponent = primaryNavigationDebugElement.componentInstance as MojPrimaryNavigationComponent;

    primaryNavigationComponent.useFragmentNavigation = true;
    primaryNavigationComponent.ngOnChanges({
      useFragmentNavigation: new SimpleChange(false, true, false),
    });
    pathFixture.detectChanges();

    expect(pathComponent.emittedFragments).toEqual(['individuals']);
  });
});
