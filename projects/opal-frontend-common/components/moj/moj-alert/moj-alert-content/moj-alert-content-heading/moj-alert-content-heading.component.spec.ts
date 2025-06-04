import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertHeadingComponent } from './moj-alert-content-heading.component';

describe('MojAlertHeadingComponent', () => {
  let component: MojAlertHeadingComponent;
  let fixture: ComponentFixture<MojAlertHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
