import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukListComponent } from './govuk-list.component';

describe('GovukListComponent', () => {
  let component: GovukListComponent;
  let fixture: ComponentFixture<GovukListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovukListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
