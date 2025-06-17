import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionsFormGroupItemComponent } from './moj-filter-options-form-group-item.component';
import { IFilterOption } from '@hmcts/opal-frontend-common/components/abstract/abstract-filter';

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit updated filter option with selected true when checkbox is checked', () => {
    const item: IFilterOption = { label: 'Urgent', value: 'urgent', selected: false, count: 3 };
    const fakeEvent = {
      target: { checked: true },
    } as unknown as Event;

    spyOn(component.changed, 'emit');
    component.onCheckboxChange(fakeEvent, item);

    // Expect the emitted value to be a copy of item with selected: true.
    expect(component.changed.emit).toHaveBeenCalledWith({ ...item, selected: true });
  });

  it('should emit updated filter option with selected false when checkbox is unchecked', () => {
    const item: IFilterOption = { label: 'Urgent', value: 'urgent', selected: true, count: 3 };
    const fakeEvent = {
      target: { checked: false },
    } as unknown as Event;

    spyOn(component.changed, 'emit');
    component.onCheckboxChange(fakeEvent, item);

    expect(component.changed.emit).toHaveBeenCalledWith({ ...item, selected: false });
  });
});
