import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GovukSkipLinkComponent } from './govuk-skip-link.component';

describe('GovukSkipLinkComponent', () => {
  let fixture: ComponentFixture<GovukSkipLinkComponent>;
  let utilsService: { focusElementById: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    utilsService = {
      focusElementById: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GovukSkipLinkComponent],
      providers: [{ provide: UtilsService, useValue: utilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSkipLinkComponent);
    fixture.detectChanges();
  });

  it('should render GOV.UK skip-link markup with default values', () => {
    const link: HTMLAnchorElement = fixture.debugElement.query(By.css('a')).nativeElement;

    expect(link.classList.contains('govuk-skip-link')).toBe(true);
    expect(link.dataset['module']).toBe('govuk-skip-link');
    expect(link.textContent).toBe('Skip to main content');
    expect(link.getAttribute('href')).toBe(`${document.location.pathname}#main-content`);
  });

  it('should render the configured target and link text', () => {
    fixture.componentRef.setInput('targetId', 'page-content');
    fixture.componentRef.setInput('linkText', 'Skip to page content');
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.debugElement.query(By.css('a')).nativeElement;

    expect(link.textContent).toBe('Skip to page content');
    expect(link.getAttribute('href')).toBe(`${document.location.pathname}#page-content`);
  });

  it('should prevent navigation and focus the configured target when clicked', () => {
    fixture.componentRef.setInput('targetId', 'page-content');
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a'));
    const event = new MouseEvent('click', { cancelable: true });

    link.triggerEventHandler('click', event);

    expect(event.defaultPrevented).toBe(true);
    expect(utilsService.focusElementById).toHaveBeenCalledWith('page-content');
  });

  it('should return the current pathname with the target ID as the href', () => {
    fixture.componentRef.setInput('targetId', 'page-content');

    expect(fixture.componentInstance.href).toBe(`${document.location.pathname}#page-content`);
  });
});
