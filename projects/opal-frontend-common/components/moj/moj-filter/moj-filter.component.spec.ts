import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterComponent } from './moj-filter.component';

describe('MojFilterComponent', () => {
  let component: MojFilterComponent;
  let fixture: ComponentFixture<MojFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
