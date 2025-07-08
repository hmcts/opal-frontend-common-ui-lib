import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukListLinkComponent } from './govuk-list-link.component';

describe('GovukListLinkComponent', () => {
  let component: GovukListLinkComponent;
  let fixture: ComponentFixture<GovukListLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukListLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovukListLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
