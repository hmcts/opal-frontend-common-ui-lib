import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertTextComponent } from './moj-alert-content-text.component';

describe('MojAlertTextComponent', () => {
  let component: MojAlertTextComponent;
  let fixture: ComponentFixture<MojAlertTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
