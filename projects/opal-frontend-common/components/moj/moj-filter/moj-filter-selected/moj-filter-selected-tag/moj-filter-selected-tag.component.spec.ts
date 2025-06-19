import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterSelectedTagComponent } from './moj-filter-selected-tag.component';

describe('MojFilterSelectedTagComponent', () => {
  let component: MojFilterSelectedTagComponent;
  let fixture: ComponentFixture<MojFilterSelectedTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterSelectedTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterSelectedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removeTagClicked event with the provided label when removeTag is called', () => {
    spyOn(component.removeTagClicked, 'emit');

    const testLabel = 'Test Tag';
    component.removeTag(testLabel);

    expect(component.removeTagClicked.emit).toHaveBeenCalledWith(testLabel);
  });

  it('should call event.preventDefault if event is provided', () => {
    spyOn(component.removeTagClicked, 'emit');
    const testLabel = 'Test Tag';
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;

    component.removeTag(testLabel, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.removeTagClicked.emit).toHaveBeenCalledWith(testLabel);
  });
});
