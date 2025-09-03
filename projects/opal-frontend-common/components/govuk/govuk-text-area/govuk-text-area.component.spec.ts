import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { GovukTextAreaComponent } from './govuk-text-area.component';

describe('GovukTextAreaComponent', () => {
  let component: GovukTextAreaComponent | null;
  let fixture: ComponentFixture<GovukTextAreaComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextAreaComponent);
    component = fixture.componentInstance;

    formControl = new FormControl(null);
    component.labelText = 'test';
    component.labelClasses = 'govuk-label--l';
    component.inputId = 'test';
    component.inputName = 'test';
    component.control = formControl;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    formControl = null;

    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the control correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const control: FormControl = new FormControl();
    component.control = control;
    expect(component.getControl).toBe(control);
  });
});
