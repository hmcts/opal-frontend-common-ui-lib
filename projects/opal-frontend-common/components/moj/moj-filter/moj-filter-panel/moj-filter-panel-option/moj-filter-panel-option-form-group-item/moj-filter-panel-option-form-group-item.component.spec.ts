import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelOptionFormGroupItemComponent } from './moj-filter-panel-option-form-group-item.component';
import { IAbstractTableFilterOption } from 'projects/opal-frontend-common/components/abstract/abstract-table-filter/interfaces/abstract-table-filter.interface';

describe('MojFilterPanelOptionFormGroupItemComponent', () => {
  let component: MojFilterPanelOptionFormGroupItemComponent;
  let fixture: ComponentFixture<MojFilterPanelOptionFormGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelOptionFormGroupItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelOptionFormGroupItemComponent);
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
    const item: IAbstractTableFilterOption = { label: 'Urgent', value: 'urgent', selected: false, count: 3 };
    const fakeEvent = {
      target: { checked: true },
    } as unknown as Event;

    spyOn(component.changed, 'emit');
    component.onCheckboxChange(fakeEvent, item);

    // Expect the emitted value to be a copy of item with selected: true.
    expect(component.changed.emit).toHaveBeenCalledWith({
      categoryName: 'Tags',
      item: { ...item, selected: true },
    });
  });

  it('should emit updated filter option with selected false when checkbox is unchecked', () => {
    const item: IAbstractTableFilterOption = { label: 'Urgent', value: 'urgent', selected: true, count: 3 };
    const fakeEvent = {
      target: { checked: false },
    } as unknown as Event;

    spyOn(component.changed, 'emit');
    component.onCheckboxChange(fakeEvent, item);

    expect(component.changed.emit).toHaveBeenCalledWith({
      categoryName: 'Tags',
      item: { ...item, selected: false },
    });
  });

  it('should render the checkbox with correct label and count', () => {
    component.options = {
      categoryName: 'Tags',
      options: [{ label: 'Urgent', value: 'urgent', selected: false, count: 3 }],
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Urgent (3)');
  });

  it('should apply the govuk-form-group class to the host element', () => {
    const hostElement = fixture.nativeElement as HTMLElement;
    expect(hostElement.classList.contains('govuk-form-group')).toBeTrue();
  });
});
