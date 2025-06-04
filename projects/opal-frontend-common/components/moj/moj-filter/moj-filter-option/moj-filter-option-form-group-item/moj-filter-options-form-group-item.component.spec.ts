import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionsFormGroupComponent } from './moj-filter-options-form-group-item.component';

describe('MojFilterOptionsFormGroupComponent', () => {
  let component: MojFilterOptionsFormGroupComponent;
  let fixture: ComponentFixture<MojFilterOptionsFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionsFormGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionsFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
