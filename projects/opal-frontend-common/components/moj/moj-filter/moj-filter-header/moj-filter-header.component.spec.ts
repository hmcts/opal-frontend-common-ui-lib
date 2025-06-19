import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterHeaderComponent } from './moj-filter-header.component';

describe('MojFilterHeaderComponent', () => {
  let component: MojFilterHeaderComponent;
  let fixture: ComponentFixture<MojFilterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
