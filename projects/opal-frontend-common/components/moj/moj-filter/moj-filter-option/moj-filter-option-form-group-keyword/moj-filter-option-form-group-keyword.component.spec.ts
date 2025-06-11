import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterOptionFormGroupKeywordComponent } from './moj-filter-option-form-group-keyword.component';

describe('MojFilterOptionFormGroupKeywordComponent', () => {
  let component: MojFilterOptionFormGroupKeywordComponent;
  let fixture: ComponentFixture<MojFilterOptionFormGroupKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterOptionFormGroupKeywordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterOptionFormGroupKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an empty string when no event is provided', () => {
    spyOn(component.keywordChange, 'emit');

    component.onKeywordChange();

    expect(component.keywordChange.emit).toHaveBeenCalledWith('');
  });

  it('should call preventDefault and emit the correct keyword from event', () => {
    const fakeEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      target: { value: 'test keyword' },
    } as unknown as Event;

    spyOn(component.keywordChange, 'emit');

    component.onKeywordChange(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.keywordChange.emit).toHaveBeenCalledWith('test keyword');
  });
});
