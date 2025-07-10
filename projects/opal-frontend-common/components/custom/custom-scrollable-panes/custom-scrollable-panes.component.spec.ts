import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomScrollablePanesComponent } from './custom-scrollable-panes.component';

describe('CustomScrollablePanesComponent', () => {
  let component: CustomScrollablePanesComponent;
  let fixture: ComponentFixture<CustomScrollablePanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomScrollablePanesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomScrollablePanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
