import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojHeaderComponent } from './moj-header.component';
import { Component } from '@angular/core';
import { MojHeaderNavigationItemComponent } from './moj-header-navigation-item/moj-header-navigation-item.component';
import { provideRouter } from '@angular/router';
import { MOJ_HEADER_LINKS_MOCK } from './mocks/moj-header-links.mock';

@Component({
  template: `<opal-lib-moj-header [headerLinks]="MOJ_HEADER_LINKS_MOCK">
    <ng-container organisationName>Test Organisation</ng-container>
    <ng-container serviceName>Test Service</ng-container>
    <opal-lib-moj-header-navigation-item>
      <ng-container linkText>Test Link</ng-container>
    </opal-lib-moj-header-navigation-item>
  </opal-lib-moj-header>`,
  imports: [MojHeaderComponent, MojHeaderNavigationItemComponent],
})
class TestHostComponent {}

describe('MojHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into organisationName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--organisation-name');
    expect(element.innerText).toBe('Test Organisation');
  });

  it('should render into serviceName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--service-name');
    expect(element.innerText).toBe('Test Service');
  });

  it('should render into linkText ng-content', () => {
    const element = fixture.nativeElement.querySelector('opal-lib-moj-header-navigation-item');
    expect(element.innerText).toBe('Test Link');
  });
});
