import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukListLinkComponent } from './govuk-list-link.component';

describe('GovukListLinkComponent', () => {
  let component: GovukListLinkComponent;
  let fixture: ComponentFixture<GovukListLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukListLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukListLinkComponent);
    component = fixture.componentInstance;
    component.linkText = 'Test Link';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit linkClickEvent on handleClick', () => {
    const fakeEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
    spyOn(component.linkClickEvent, 'emit');
    component.handleClick(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.linkClickEvent.emit).toHaveBeenCalled();
  });

  it('should handle event without preventDefault method gracefully', () => {
    const fakeEvent = {} as Event;
    spyOn(component.linkClickEvent, 'emit');
    component.handleClick(fakeEvent);
    expect(component.linkClickEvent.emit).toHaveBeenCalled();
  });
});
