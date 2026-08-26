import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { MojAlertComponent } from './moj-alert.component';
import { CustomDeferredLiveRegionAnnouncement } from '@hmcts/opal-frontend-common/components/custom/custom-deferred-live-region-announcement';
import { By } from '@angular/platform-browser';

describe('MojAlertComponent', () => {
  let component: MojAlertComponent;
  let fixture: ComponentFixture<MojAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertComponent);
    component = fixture.componentInstance;
    component.ariaLabel = 'Close Alert';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class applied when visible and type is information', () => {
    component.isVisible = true;
    component.type = 'information';

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.className).toContain('moj-alert');
    expect(element.className).toContain('moj-alert--information');
  });

  it('should update host class when type changes', () => {
    component.isVisible = true;
    component.type = 'error';

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.className).toContain('moj-alert');
    expect(element.className).toContain('moj-alert--error');
  });

  it('should have an empty class when component is not visible', () => {
    component.isVisible = false;
    component.type = 'warning';

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.className.trim()).toBe('');
  });

  it.each([
    ['information', 'information: Close Alert'],
    ['success', 'success: Close Alert'],
    ['warning', 'warning: Close Alert'],
    ['error', 'error: Close Alert'],
  ] as const)('should return the correct announcement message for type %s', (type, expectedMessage) => {
    component.type = type;

    expect(component.announcementMessage).toBe(expectedMessage);
  });

  it.each([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['success', 'status'],
    ['information', 'status'],
  ] as const)('should return the correct announcement role', (type, expectedRole) => {
    component.type = type;

    expect(component.announcementRole).toBe(expectedRole);
  });

  it('should set the data-module attribute to "moj-alert"', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.getAttribute('data-module')).toBe('moj-alert');
  });

  it('should dismiss the alert when dismiss is called and emit a `dismissed` event', () => {
    const emitSpy = vi.spyOn(component.dismissed, 'emit');

    component.isVisible = true;
    component.type = 'information';

    component.dismiss();

    expect(component.isVisible).toBe(false);
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should pass announcement inputs to the deferred live region', () => {
    component.ariaLabel = 'Close Alert';
    component.type = 'warning';

    fixture.detectChanges();

    const liveRegionDebugElement = fixture.debugElement.query(By.directive(CustomDeferredLiveRegionAnnouncement));

    expect(liveRegionDebugElement).toBeTruthy();

    const liveRegion = liveRegionDebugElement.componentInstance as CustomDeferredLiveRegionAnnouncement;

    expect(liveRegion.message).toBe('warning: Close Alert');
    expect(liveRegion.role).toBe('alert');
    expect(liveRegion.announcementDelayMs).toBe(200);
  });

  it('should not render the deferred live region when the alert is not visible', () => {
    component.isVisible = false;

    fixture.detectChanges();

    const liveRegion = fixture.debugElement.query(By.directive(CustomDeferredLiveRegionAnnouncement));

    expect(liveRegion).toBeNull();
  });

  it('should not render the deferred live region when live announcements are disabled', () => {
    component.enableLiveAnnouncement = false;

    fixture.detectChanges();

    const liveRegion = fixture.debugElement.query(
      By.directive(CustomDeferredLiveRegionAnnouncement),
    );

    expect(liveRegion).toBeNull();
  });

  it('should not require ariaLabel when live announcements are disabled', () => {
    component.ariaLabel = undefined;
    component.enableLiveAnnouncement = false;

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it.each([undefined, '', '   '])(
    'should require a non-empty ariaLabel when live announcements are enabled',
    (ariaLabel) => {
      component.ariaLabel = ariaLabel;
      component.enableLiveAnnouncement = true;

      expect(() => fixture.detectChanges()).toThrow(
        'MojAlertComponent requires ariaLabel when live announcements are enabled. ' +
        'Provide ariaLabel or set enableLiveAnnouncement to false.',
      );
    },
  );
});
