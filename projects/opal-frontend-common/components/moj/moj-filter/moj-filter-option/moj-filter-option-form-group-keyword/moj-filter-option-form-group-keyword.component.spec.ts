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

  it('should emit the correct keyword when an event with a valid input value is provided', () => {
    spyOn(component.keywordChange, 'emit');

    const inputValue = 'test keyword';
    const fakeEvent = { target: { value: inputValue } } as unknown as Event;

    component.onKeywordChange(fakeEvent);
    expect(component.keywordChange.emit).toHaveBeenCalledWith(inputValue);
  });
});
