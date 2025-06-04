import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionFormGroupKeywordComponent } from './moj-filter-option-form-group-keyword.component';

describe('MojFilterOptionFormGroupKeywordComponent', () => {
  let component: MojFilterOptionFormGroupKeywordComponent;
  let fixture: ComponentFixture<MojFilterOptionFormGroupKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionFormGroupKeywordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionFormGroupKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
