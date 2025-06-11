import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionComponent } from './moj-filter-option.component';

describe('MojFilterOptionComponent', () => {
  let component: MojFilterOptionComponent;
  let fixture: ComponentFixture<MojFilterOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit applyFilters event when no event is provided', () => {
    spyOn(component.applyFilters, 'emit');
    component.onApplyFilters();
    expect(component.applyFilters.emit).toHaveBeenCalled();
  });

  it('should call event.preventDefault if event is provided', () => {
    spyOn(component.applyFilters, 'emit');
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;

    component.onApplyFilters(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.applyFilters.emit).toHaveBeenCalledWith();
  });
});
