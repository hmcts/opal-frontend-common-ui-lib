import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionComponent } from './moj-filter-option.component';

describe('MojFilterOptionComponent', () => {
  let component: MojFilterOptionComponent;
  let fixture: ComponentFixture<MojFilterOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
