import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukHeaderComponent } from './govuk-header.component';
import { Component } from '@angular/core';
import { GovukHeaderNavigationItemComponent } from './govuk-header-navigation-item/govuk-header-navigation-item.component';
import { provideRouter } from '@angular/router';
import { GOVUK_HEADER_LINKS_MOCK } from './mocks/govuk-header-links.mock';

@Component({
  template: `<opal-lib-govuk-header [headerLinks]="headerLinks">
    <ng-container organisationName>Test Organisation</ng-container>
    <ng-container serviceName>Test Service</ng-container>
    <opal-lib-govuk-header-navigation-item>
      <ng-container linkText>Test Link</ng-container>
    </opal-lib-govuk-header-navigation-item>
  </opal-lib-govuk-header>`,
  imports: [GovukHeaderComponent, GovukHeaderNavigationItemComponent],
})
class TestHostComponent {
  public headerLinks = GOVUK_HEADER_LINKS_MOCK;
}

describe('GovukHeaderComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
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

  it('should render into organisationName ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.govuk-header__logotype-text');
    expect(element.innerText).toBe('Test Organisation');
  });

  it('should render into serviceName ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.govuk-header__service-name');
    expect(element.innerText).toBe('Test Service');
  });

  it('should render into linkText ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('opal-lib-govuk-header-navigation-item');
    expect(element.innerText).toBe('Test Link');
  });
});
