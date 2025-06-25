import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelSelectedTagComponent } from './moj-filter-panel-selected-tag.component';

describe('MojFilterPanelSelectedTagComponent', () => {
  let component: MojFilterPanelSelectedTagComponent;
  let fixture: ComponentFixture<MojFilterPanelSelectedTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelSelectedTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelSelectedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removeTagClicked event with the provided label when removeTag is called', () => {
    spyOn(component.removeTagClicked, 'emit');

    const categoryName = 'Test Category';
    const optionValue = 'Test Tag';
    component.removeTag(categoryName, optionValue);

    expect(component.removeTagClicked.emit).toHaveBeenCalledWith({ categoryName, optionValue });
  });

  it('should call event.preventDefault if event is provided', () => {
    spyOn(component.removeTagClicked, 'emit');
    const categoryName = 'Test Category';
    const optionValue = 'Test Tag';
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;

    component.removeTag(categoryName, optionValue, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.removeTagClicked.emit).toHaveBeenCalledWith({ categoryName, optionValue });
  });
});
