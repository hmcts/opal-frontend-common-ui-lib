import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertContentComponent } from './moj-alert-content.component';

describe('MojAlertContentComponent', () => {
  let component: MojAlertContentComponent;
  let fixture: ComponentFixture<MojAlertContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojAlertContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
