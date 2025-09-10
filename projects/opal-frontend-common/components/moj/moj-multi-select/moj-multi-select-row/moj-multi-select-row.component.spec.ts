import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojMultiSelectRow } from './moj-multi-select-row.component';

describe('MojMultiSelectRow', () => {
  let component: MojMultiSelectRow;
  let fixture: ComponentFixture<MojMultiSelectRow>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiSelectRow],
    }).compileComponents();

    fixture = TestBed.createComponent(MojMultiSelectRow);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
  });

  function setInputs(id: string, rowIdentifier: string | number, checked = false) {
    component.id = id;
    component.rowIdentifier = rowIdentifier;
    component.checked = checked;
    fixture.detectChanges();
  }

  it('should create', () => {
    setInputs('check-and-validate-table', 123);
    expect(component).toBeTruthy();
  });

  it('applies GOV.UK cell class to the host', () => {
    setInputs('check-and-validate-table', 123);
    expect(host.classList.contains('govuk-table__cell')).toBeTrue();
  });

  it('sets host id from base id + rowIdentifier', () => {
    setInputs('check-and-validate-table', 123);
    expect(host.getAttribute('id')).toBe('check-and-validate-table-123-cell');
  });

  it('derives checkbox id and connects the label', () => {
    setInputs('check-and-validate-table', 456);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;
    const label = host.querySelector('label.govuk-checkboxes__label') as HTMLLabelElement;

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();

    expect(input.id).toBe('check-and-validate-table-456-input');
    expect(label.getAttribute('for')).toBe('check-and-validate-table-456-input');
  });

  it('respects the initial checked input', () => {
    setInputs('check-and-validate-table', 1, true);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;
    expect(input.checked).toBeTrue();
  });

  it('emits toggled=true when the checkbox is checked', () => {
    setInputs('check-and-validate-table', 2, false);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;

    const emitted: boolean[] = [];
    component.toggled.subscribe((v) => emitted.push(v));

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('emits toggled=false when the checkbox is unchecked', () => {
    setInputs('check-and-validate-table', 3, true);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;

    const emitted: boolean[] = [];
    component.toggled.subscribe((v) => emitted.push(v));

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([false]);
  });

  it('does not set a host id when inputs are incomplete', () => {
    // rowIdentifier missing -> no host id
    component.id = 'check-and-validate-table';
    // @ts-expect-error test the runtime path where rowIdentifier is not set
    component.rowIdentifier = undefined;
    fixture.detectChanges();

    expect(host.hasAttribute('id')).toBeFalse();
  });
});
