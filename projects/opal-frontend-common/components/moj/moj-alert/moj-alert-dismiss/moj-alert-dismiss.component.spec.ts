import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojAlertDismissComponent } from './moj-alert-dismiss.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojAlertDismissComponent', () => {
  let component: MojAlertDismissComponent;
  let fixture: ComponentFixture<MojAlertDismissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertDismissComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertDismissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class applied', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.classList).toContain('moj-alert__action');
  });

  it('should emit dismiss event when emit is called', () => {
    let wasEmitted = false;
    component.dismiss.subscribe(() => {
      wasEmitted = true;
    });
    component.dismiss.emit();
    expect(wasEmitted).toBe(true);
  });

  it('should emit dismiss event when dismissAlert is called without an event', () => {
    let wasEmitted = false;
    component.dismiss.subscribe(() => {
      wasEmitted = true;
    });
    component.dismissAlert();
    expect(wasEmitted).toBe(true);
  });

  it('should prevent default and stop propagation when dismissAlert is called with an event', () => {
    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as MouseEvent;

    let wasEmitted = false;
    component.dismiss.subscribe(() => {
      wasEmitted = true;
    });
    component.dismissAlert(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(wasEmitted).toBe(true);
  });
});
