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
});
