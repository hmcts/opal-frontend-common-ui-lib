import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomActionLinksComponent } from './custom-action-links.component';

describe('CustomActionLinksComponent', () => {
  let component: CustomActionLinksComponent;
  let fixture: ComponentFixture<CustomActionLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomActionLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomActionLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have host binding class set to govuk-grid-column-one-third', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.className).toContain('govuk-grid-column-one-third');
  });
});
