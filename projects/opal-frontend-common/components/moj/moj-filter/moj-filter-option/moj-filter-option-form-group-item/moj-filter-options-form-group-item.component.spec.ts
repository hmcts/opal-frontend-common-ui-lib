import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionsFormGroupItemComponent } from './moj-filter-options-form-group-item.component';
import { IFilterOption } from '../../interfaces/filter-interfaces';

describe('MojFilterOptionsFormGroupComponent', () => {
  let component: MojFilterOptionsFormGroupItemComponent;
  let fixture: ComponentFixture<MojFilterOptionsFormGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionsFormGroupItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionsFormGroupItemComponent);
    component = fixture.componentInstance;
    component.options = {
      categoryName: 'Tags',
      options: [{ label: 'Urgent', value: 'urgent', selected: false, count: 3 }],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the selected property and emit the updated filter option when an event is provided', () => {
    const item: IFilterOption = { label: 'Urgent', value: 'urgent', selected: false, count: 3 };
    const fakeEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      target: { checked: true },
    } as unknown as Event;

    spyOn(component.changed, 'emit');

    component.onCheckboxChange(item, fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(item.selected).toBeTrue();
    expect(component.changed.emit).toHaveBeenCalledWith(item);
  });

  it('should emit the filter option without modifying selected when no event is provided', () => {
    const item: IFilterOption = { label: 'Urgent', value: 'urgent', selected: false, count: 3 };

    spyOn(component.changed, 'emit');

    component.onCheckboxChange(item);

    expect(item.selected).toBeFalse();
    expect(component.changed.emit).toHaveBeenCalledWith(item);
  });
});
