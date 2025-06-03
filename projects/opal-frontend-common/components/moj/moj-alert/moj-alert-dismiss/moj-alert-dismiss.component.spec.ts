import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertDismissComponent } from './moj-alert-dismiss.component';

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

  it('should emit dismiss event when emit is called', () => {
    let wasEmitted = false;
    component.dismiss.subscribe(() => {
      wasEmitted = true;
    });
    component.dismiss.emit();
    expect(wasEmitted).toBe(true);
  });
});
