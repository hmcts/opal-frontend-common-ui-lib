import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovUkErrorMessageComponent } from './govuk-error-message.component';

describe('GovUkErrorMessageComponent', () => {
  let component: GovUkErrorMessageComponent;
  let fixture: ComponentFixture<GovUkErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovUkErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovUkErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
