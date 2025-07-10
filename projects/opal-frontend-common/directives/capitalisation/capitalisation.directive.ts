import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Directive({
  selector: '[opalLibCapitaliseAllCharacters]',
})
export class CapitalisationDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input('opalLibCapitaliseAllCharacters') control!: AbstractControl;

  constructor(private readonly utilsService: UtilsService) {}

  ngOnInit(): void {
    if (!this.control) return;

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (typeof value === 'string' && value.length > 0) {
        const upper = this.utilsService.upperCaseAllLetters(value);
        if (value !== upper) {
          this.control.setValue(upper, { emitEvent: false });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
