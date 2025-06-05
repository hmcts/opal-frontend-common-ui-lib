import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterSelectedTagComponent } from './moj-filter-selected-tag.component';

describe('MojFilterSelectedTagComponent', () => {
  let component: MojFilterSelectedTagComponent;
  let fixture: ComponentFixture<MojFilterSelectedTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterSelectedTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojFilterSelectedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
