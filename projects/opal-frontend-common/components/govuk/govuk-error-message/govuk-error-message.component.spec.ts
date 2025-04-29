import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukErrorMessageComponent } from './govuk-error-message.component';
import { By } from '@angular/platform-browser';

describe('GovUkErrorMessageComponent', () => {
  let component: GovukErrorMessageComponent;
  let fixture: ComponentFixture<GovukErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message when error is true', () => {
    component.error = true;
    component.errorMessage = 'This is an error message';
    component.elementId = 'error-id';
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.govuk-error-message'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('This is an error message');
  });

  it('should not display the error message when error is false', () => {
    component.error = false;
    component.errorMessage = 'This is an error message';
    component.elementId = 'error-id';
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.govuk-error-message'));
    expect(errorElement).toBeNull();
  });
});
