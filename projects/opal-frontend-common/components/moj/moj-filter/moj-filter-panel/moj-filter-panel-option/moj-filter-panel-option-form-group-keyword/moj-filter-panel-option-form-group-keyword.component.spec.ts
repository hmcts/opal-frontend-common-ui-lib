import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojFilterPanelOptionFormGroupKeywordComponent } from './moj-filter-panel-option-form-group-keyword.component';

describe('MojFilterPanelOptionFormGroupKeywordComponent', () => {
  let component: MojFilterPanelOptionFormGroupKeywordComponent;
  let fixture: ComponentFixture<MojFilterPanelOptionFormGroupKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelOptionFormGroupKeywordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelOptionFormGroupKeywordComponent);
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

  it('should render the label and input with default values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const input = compiled.querySelector('input');

    expect(label?.textContent?.trim()).toBe('Keywords');
    expect(label?.getAttribute('for')).toBe('keywords');
    expect(input?.id).toBe('keywords');
    expect(input?.name).toBe('keywords');
  });
});
