import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterSelectedComponent } from './moj-filter-selected.component';

describe('MojFilterSelectedComponent', () => {
  let component: MojFilterSelectedComponent;
  let fixture: ComponentFixture<MojFilterSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojFilterSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
