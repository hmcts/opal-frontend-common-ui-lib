import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';
import {
  CUSTOM_DATE_FILTER_DEFAULTS,
  CUSTOM_DATE_FILTER_LAST_7_DAYS,
  CUSTOM_DATE_FILTER_CUSTOM_DAYS,
  CUSTOM_DATE_FILTER_DATE_RANGE,
} from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/constants';
import { clearInactiveCustomDateFilterFields } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/utils';

/**
 * Renders date-mode controls owned by the parent form and clears inactive conditional fields.
 * Validation, date-range calculation and submission remain the parent's responsibility.
 */
@Component({
  selector: 'opal-lib-custom-date-filter',
  imports: [ReactiveFormsModule, GovukRadioComponent, GovukRadiosItemComponent, MojDatePickerComponent],
  templateUrl: './custom-date-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDateFilterComponent implements OnChanges, OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private dateFilterSubscription?: Subscription;

  public readonly dateFilterLast7Days = CUSTOM_DATE_FILTER_LAST_7_DAYS;
  public readonly dateFilterCustomDays = CUSTOM_DATE_FILTER_CUSTOM_DAYS;
  public readonly dateFilterDateRange = CUSTOM_DATE_FILTER_DATE_RANGE;

  @Input({ required: true }) controls!: ICustomDateFilterControls;
  @Input({ required: true }) idPrefix!: string;
  @Input() legendText: string = CUSTOM_DATE_FILTER_DEFAULTS.legendText;
  @Input() legendClasses: string = CUSTOM_DATE_FILTER_DEFAULTS.legendClasses;
  @Input() dateHintText: string = CUSTOM_DATE_FILTER_DEFAULTS.dateHintText;
  @Input() errors: Readonly<Record<string, string>> = {};

  /**
   * Rebinds the date-mode subscription to the current parent controls after input changes.
   * Mode changes clear inactive fields and refresh the conditional sections under OnPush.
   */
  public ngOnChanges(): void {
    this.dateFilterSubscription?.unsubscribe();
    this.dateFilterSubscription = this.controls.dateFilter.valueChanges.subscribe((dateFilter) => {
      clearInactiveCustomDateFilterFields(this.controls, dateFilter);
      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * Releases the parent-control subscription when the date filter is destroyed.
   */
  public ngOnDestroy(): void {
    this.dateFilterSubscription?.unsubscribe();
  }

  /**
   * Stores a normalized date-picker edit and marks the owning form control dirty.
   * @param field - The parent-owned boundary control to update.
   * @param value - The normalized date text emitted by the picker.
   */
  public onDateChange(field: 'dateFrom' | 'dateTo', value: string): void {
    const control = this.controls[field];
    control.markAsDirty();
    control.setValue(value);
  }
}
