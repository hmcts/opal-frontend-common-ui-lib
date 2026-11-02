import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojHeaderComponent } from './moj-header.component';
import { Component } from '@angular/core';
import { MojHeaderNavigationItemComponent } from './moj-header-navigation-item/moj-header-navigation-item.component';
import { provideRouter } from '@angular/router';
import { MOJ_HEADER_LINKS_MOCK } from './mocks/moj-header-links.mock';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-moj-header [headerLinks]="headerLinks">
    <ng-container organisationName>Test Organisation</ng-container>
    <ng-container serviceName>Test Service</ng-container>
    <opal-lib-moj-header-navigation-item>
      <ng-container linkText>Test Link</ng-container>
    </opal-lib-moj-header-navigation-item>
  </opal-lib-moj-header>`,
  imports: [MojHeaderComponent, MojHeaderNavigationItemComponent],
})
class TestHostComponent {
  public headerLinks = MOJ_HEADER_LINKS_MOCK;
}

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
    expect(element.textContent?.trim()).toBe('Test Organisation');
  });

  it('should link the organisation name to the configured organisation page', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--organisation-name');
    expect(element.getAttribute('href')).toBe(MOJ_HEADER_LINKS_MOCK.organisationLink);
  });

  it('should link the GOV.UK logo to the configured GOV.UK page', () => {
    const element = fixture.nativeElement.querySelector('.govuk-header__link');
    expect(element.getAttribute('href')).toBe(MOJ_HEADER_LINKS_MOCK.govukLink);
  });

  it('should render into serviceName ng-content', () => {
    const element = fixture.nativeElement.querySelector('.moj-header__link--service-name');
    expect(element.textContent?.trim()).toBe('Test Service');
  });

  it('should render into linkText ng-content', () => {
    const element = fixture.nativeElement.querySelector('opal-lib-moj-header-navigation-item');
    expect(element.textContent?.trim()).toBe('Test Link');
  });

  it('should use non-link elements for organisation and service names when there are no links', () => {
    const noLinksFixture = TestBed.createComponent(TestHostComponent);
    noLinksFixture.componentInstance.headerLinks = {
      ...MOJ_HEADER_LINKS_MOCK,
      organisationLink: '',
      serviceLink: '',
    };
    noLinksFixture.detectChanges();

    const organisationName = noLinksFixture.nativeElement.querySelector('.moj-header__link--organisation-name');
    const serviceName = noLinksFixture.nativeElement.querySelector('.moj-header__link--service-name');

    expect(organisationName.tagName).toBe('SPAN');
    expect(serviceName.tagName).toBe('SPAN');
    expect(noLinksFixture.nativeElement.querySelector('.moj-header__link--organisation-name[href]')).toBeNull();
    expect(noLinksFixture.nativeElement.querySelector('.moj-header__link--service-name[href]')).toBeNull();

    noLinksFixture.destroy();
  });
});
