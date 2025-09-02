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

  it('should have the correct host class applied when visible and type is information', () => {
    component.isVisible = true;
    component.type = 'information';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.className).toContain(`moj-alert`);
    expect(element.className).toContain(`moj-alert--information`);
  });

  it('should update host class when type changes', () => {
    component.isVisible = true;
    component.type = 'error';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.className).toContain(`moj-alert`);
    expect(element.className).toContain(`moj-alert--error`);
  });

  it('should have an empty class when component is not visible', () => {
    component.isVisible = false;
    // Even if type is set, visibility takes precedence
    component.type = 'warning';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.className.trim()).toBe('');
  });

  it('should compute the correct aria-label attribute', () => {
    component.ariaLabel = 'Close Alert';
    component.type = 'warning';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.getAttribute('aria-label')).toBe('warning : Close Alert');
  });

  it('should set the data-module attribute to "moj-alert"', () => {
    fixture.detectChanges();
    const element: HTMLElement | null = fixture.nativeElement;
    expect(element?.getAttribute('data-module')).toBe('moj-alert');
  });

  it('should dismiss the alert when dismiss is called and emit a `dismissed` event', () => {
    spyOn(component.dismissed, 'emit');
    component.isVisible = true;
    component.type = 'information';
    fixture.detectChanges();

    component.dismiss();
    fixture.detectChanges();

    expect(component.isVisible).toBeFalse();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.className.trim()).toBe('');
    expect(component.dismissed.emit).toHaveBeenCalled();
  });
});
