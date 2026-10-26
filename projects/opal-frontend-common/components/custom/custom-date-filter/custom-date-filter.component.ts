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

  public ngOnChanges(): void {
    this.dateFilterSubscription?.unsubscribe();
    this.dateFilterSubscription = this.controls.dateFilter.valueChanges.subscribe((dateFilter) => {
      clearInactiveCustomDateFilterFields(this.controls, dateFilter);
      this.changeDetectorRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.dateFilterSubscription?.unsubscribe();
  }

  /** Stores the normalized value emitted by either date picker. */
  public onDateChange(field: 'dateFrom' | 'dateTo', value: string): void {
    this.controls[field].setValue(value);
  }
}
