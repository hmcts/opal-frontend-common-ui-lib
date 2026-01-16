import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IAlphagovAccessibleAutocompleteItem } from './interfaces/alphagov-accessible-autocomplete-item.interface';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { Subject, pairwise, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'opal-lib-alphagov-accessible-autocomplete',
  imports: [ReactiveFormsModule],
  templateUrl: './alphagov-accessible-autocomplete.component.html',
  styleUrl: './alphagov-accessible-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphagovAccessibleAutocompleteComponent implements OnInit, OnDestroy, OnChanges {
  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _control!: FormControl;
  private readonly ngUnsubscribe = new Subject<void>();
  private describedByObserver: MutationObserver | null = null;
  private containerObserver: MutationObserver | null = null;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: true }) autoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() showAllValues = true;
  @Input({ required: false }) errors: string | null = null;

  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  public autoCompleteId!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureAutoComplete();
    });
  }

  /**
   * Gets the control for the alphagov-accessible-autocomplete component.
   * @returns The control for the component.
   */
  get getControl() {
    return this._control;
  }

  /**
   * Handles the confirmation of a selected name.
   *
   * @param selectedName - The selected name.
   * @returns void
   */

  private handleOnConfirm(selectedName: string | undefined): void {
    // selectedName is populated on selecting an option but is undefined onBlur, so we need to grab the input value directly from the input
    const control = this._control;
    const name = selectedName ?? (document.querySelector(`#${this.autoCompleteId}`) as HTMLInputElement).value;
    const selectedItem = this.autoCompleteItems.find((item) => item.name === name) ?? null;
    const previousValue = control.value;
    const selectedValue = selectedItem?.value ?? null;

    control.setValue(selectedValue);
    control.markAsTouched();

    // Handles initial empty state when the user clicks away from the input
    if (selectedItem === null && previousValue === null) {
      control.markAsPristine();
    } else if (selectedItem?.value !== previousValue) {
      control.markAsDirty();
    }

    control.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }

  /**
   * Retrieves the default value for the autocomplete component.
   *
   * @returns The default value as a string.
   */

  private getDefaultValue() {
    return this.autoCompleteItems.find((item) => item.value === this._control.value)?.name ?? '';
  }

  /**
   * Builds the props object for the AccessibleAutocomplete component.
   * @returns The props object for the AccessibleAutocomplete component.
   */
  private buildAutoCompleteProps(): AccessibleAutocompleteProps {
    return {
      id: this.autoCompleteId,
      element: this.autocompleteContainer.nativeElement,
      source: this.autoCompleteItems.map((item) => item.name),
      name: this.autoCompleteId,
      showAllValues: this.showAllValues,
      defaultValue: this.getDefaultValue(),
      dropdownArrow: ({ className }) => this.renderDropdownArrow(className),
      onConfirm: (selectedName: string) => this.handleOnConfirm(selectedName),
    };
  }

  /**
   * Renders a custom dropdown arrow.
   * @param className – The class to apply to the SVG.
   * @returns An SVG string for the dropdown arrow.
   */
  private renderDropdownArrow(className: string): string {
    return `
   <svg class="${className}" style="top: 8px;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9
                    c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7
                    c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3z"></path>
          </svg>`;
  }

  /**
   * Configures the auto-complete functionality using the accessible-autocomplete library.
   */
  private configureAutoComplete(): void {
    import('accessible-autocomplete').then((accessibleAutocomplete) => {
      accessibleAutocomplete.default(this.buildAutoCompleteProps());
      this.waitForInputAndApply();
    });
  }

  /**
   * Gets the rendered autocomplete text input, if present.
   */
  private getVisibleInput(): HTMLInputElement | null {
    return this.autocompleteContainer?.nativeElement?.querySelector(`#${this.autoCompleteId}`);
  }

  /**
   * Builds the hint/error ids to apply to aria-describedby.
   */
  private buildDescribedByIds(): string[] {
    const ids: string[] = [];

    if (this.hintText) {
      ids.push(`${this.inputId}-hint`);
    }

    if (this.errors) {
      ids.push(`${this.autoCompleteId}-error-message`);
    }

    return ids;
  }

  /**
   * Updates aria-describedby on the visible input, preserving any non-managed ids.
   */
  private applyDescribedBy(): void {
    const input = this.getVisibleInput();
    if (!input) {
      return;
    }

    const managedIds = new Set([`${this.inputId}-hint`, `${this.autoCompleteId}-error-message`]);
    const currentValue = input.getAttribute('aria-describedby') ?? '';
    const currentIds = currentValue.split(' ').filter(Boolean);
    const preservedIds = currentIds.filter((id) => !managedIds.has(id));
    const nextIds = [...new Set([...preservedIds, ...this.buildDescribedByIds()])];
    const nextValue = nextIds.length ? nextIds.join(' ') : '';

    if (currentValue === nextValue) {
      return;
    }

    if (nextValue) {
      input.setAttribute('aria-describedby', nextValue);
    } else {
      input.removeAttribute('aria-describedby');
    }
  }

  /**
   * Observes aria-describedby changes on the visible input to reapply managed ids.
   */
  private observeDescribedBy(): void {
    const input = this.getVisibleInput();
    if (!input || typeof MutationObserver === 'undefined') {
      return;
    }

    this.describedByObserver?.disconnect();
    this.describedByObserver = new MutationObserver(() => this.applyDescribedBy());
    this.describedByObserver.observe(input, { attributes: true, attributeFilter: ['aria-describedby'] });
    this.applyDescribedBy();
  }

  /**
   * Waits for the visible input to appear, then applies describedby and observers.
   */
  private waitForInputAndApply(): void {
    const input = this.getVisibleInput();
    if (input) {
      this.observeDescribedBy();
      return;
    }

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.containerObserver?.disconnect();
    this.containerObserver = new MutationObserver(() => {
      if (this.getVisibleInput()) {
        this.containerObserver?.disconnect();
        this.observeDescribedBy();
      }
    });

    this.containerObserver.observe(this.autocompleteContainer.nativeElement, { childList: true, subtree: true });
  }

  /**
   * Sets up the control subscription for value changes.
   * Whenever the control value changes, this method is called to handle the changes.
   * If the new value is null, it clears the autocomplete container and configures the autocomplete.
   */
  private setupControlSub(): void {
    this._control.valueChanges
      .pipe(startWith(null), pairwise(), takeUntil(this.ngUnsubscribe))
      .subscribe(([prev, next]) => {
        // If both values are null, we don't need to do anything
        if (prev === null && next === null) {
          return;
        }

        // Otherwise, next is null, we need to clear the autocomplete
        if (next === null) {
          this.autocompleteContainer.nativeElement.innerHTML = '';
          this.configureAutoComplete();
        }
      });
  }

  ngOnInit(): void {
    this.autoCompleteId = this.inputId + '-autocomplete';
    this.setupControlSub();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hintText'] || changes['errors']) {
      this.applyDescribedBy();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.describedByObserver?.disconnect();
    this.containerObserver?.disconnect();
  }
}
