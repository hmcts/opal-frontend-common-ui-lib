import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCancelLinkComponent } from './govuk-cancel-link.component';
import { describe, beforeEach, afterAll, it, expect, vi } from 'vitest';

describe('GovukCancelLinkComponent', () => {
  let component: GovukCancelLinkComponent | null;
  let fixture: ComponentFixture<GovukCancelLinkComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCancelLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukCancelLinkComponent);
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

  it('should handle the click', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    vi.spyOn(component.linkClickEvent, 'emit');

    component.handleClick();

    fixture.detectChanges();

    expect(component.linkClickEvent.emit).toHaveBeenCalledWith(true);
  });

  it('should render expected link attributes and pass click event with preventDefault', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement | null;

    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute('href')).toBe('');
    expect(anchor?.classList.contains('govuk-link')).toBe(true);
    expect(anchor?.classList.contains('button-link')).toBe(true);
    expect(anchor?.classList.contains('govuk-link--no-visited-state')).toBe(true);

    const handleClickSpy = vi.spyOn(component, 'handleClick');
    const emitSpy = vi.spyOn(component.linkClickEvent, 'emit');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

    anchor?.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(handleClickSpy).toHaveBeenCalledWith(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(true);
  });
});
