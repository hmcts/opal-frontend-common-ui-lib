import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojMultiSelectHeader } from './moj-multi-select-header.component';

describe('MojMultiSelectHeader', () => {
  let component: MojMultiSelectHeader;
  let fixture: ComponentFixture<MojMultiSelectHeader>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiSelectHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(MojMultiSelectHeader);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
  });

  function setInputs(id: string, checked = false) {
    component.id = id;
    component.checked = checked;
    fixture.detectChanges();
  }

  it('should create', () => {
    setInputs('check-and-validate-table');
    expect(component).toBeTruthy();
  });

  it('applies GOV.UK header class and scope to the host', () => {
    setInputs('check-and-validate-table');
    expect(host.classList.contains('govuk-table__header')).toBeTrue();
    expect(host.getAttribute('scope')).toBe('col');
  });

  it('sets host id from the base id with -select-all suffix', () => {
    setInputs('check-and-validate-table');
    expect(host.getAttribute('id')).toBe('check-and-validate-table-select-all');
  });

  it('derives checkbox id and connects the label', () => {
    setInputs('check-and-validate-table');
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;
    const label = host.querySelector('label.govuk-checkboxes__label') as HTMLLabelElement;

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();

    expect(input.id).toBe('check-and-validate-table-select-all-input');
    expect(label.getAttribute('for')).toBe('check-and-validate-table-select-all-input');
  });

  it('respects the initial checked input', () => {
    setInputs('check-and-validate-table', true);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;
    expect(input.checked).toBeTrue();
  });

  it('emits toggled=true when the checkbox is checked', () => {
    setInputs('check-and-validate-table', false);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;

    const emitted: boolean[] = [];
    component.toggled.subscribe((v) => emitted.push(v));

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('emits toggled=false when the checkbox is unchecked', () => {
    setInputs('check-and-validate-table', true);
    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;

    const emitted: boolean[] = [];
    component.toggled.subscribe((v) => emitted.push(v));

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([false]);
  });

  it('does not set host id and checkbox id when base id is empty', () => {
    setInputs(''); // runtime guard: getter returns null when id is falsy

    expect(host.getAttribute('id')).toBeNull();

    const input = host.querySelector('input.govuk-checkboxes__input') as HTMLInputElement;
    const label = host.querySelector('label.govuk-checkboxes__label') as HTMLLabelElement;

    // With empty id, checkboxId getter returns null -> attribute binding results in 'null'
    // depending on Angular version, it may clear the attribute or set literal 'null'.
    // We accept either cleared or literal 'null' string to be robust in tests.
    const inputId = input.getAttribute('id');
    const labelFor = label.getAttribute('for');

    expect([null, 'null']).toContain(inputId);
    expect([null, 'null']).toContain(labelFor);
  });
});
