import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertComponent } from './moj-alert.component';

describe('MojAlertComponent', () => {
  let component: MojAlertComponent;
  let fixture: ComponentFixture<MojAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default values', () => {
    expect(component.text).toBe('');
    expect(component.type).toBe('information');
    expect(component.icon).toBeTrue();
    expect(component.dismissible).toBeFalse();
    expect(component.heading).toBe('');
    expect(component.isVisible).toBeTrue();
  });

  it('should be visible by default', () => {
    expect(component.isVisible).toBeTrue();
  });

  it('should hide alert when handleDismiss is called', () => {
    component.handleDismiss();
    expect(component.isVisible).toBeFalse();
  });

  it('should accept and render @Input properties', () => {
    component.text = 'Test alert';
    component.type = 'success';
    component.icon = false;
    component.dismissible = true;
    component.heading = 'Test Heading';
    fixture.detectChanges();

    expect(component.text).toBe('Test alert');
    expect(component.type).toBe('success');
    expect(component.icon).toBeFalse();
    expect(component.dismissible).toBeTrue();
    expect(component.heading).toBe('Test Heading');
  });

  it('should render heading if provided', () => {
    component.heading = 'Alert Heading';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alert Heading');
  });
});
