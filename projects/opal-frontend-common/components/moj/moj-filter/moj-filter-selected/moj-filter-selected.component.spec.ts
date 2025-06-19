import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterSelectedComponent } from './moj-filter-selected.component';

describe('MojFilterSelectedComponent', () => {
  let component: MojFilterSelectedComponent;
  let fixture: ComponentFixture<MojFilterSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterSelectedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clearFilters when clearTag is called without an event', () => {
    spyOn(component.clearFilters, 'emit');
    component.clearTag();
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });

  it('should call preventDefault and emit clearFilters when clearTag is called with an event', () => {
    const fakeEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
    spyOn(component.clearFilters, 'emit');
    component.clearTag(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });
});
