import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'opal-lib-govuk-radio',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadioComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) fieldSetId!: string;
  @Input({ required: false }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) radioClasses!: string;
  @Input({ required: false }) errors!: string | null;

  /**
   * Builds the aria-describedby value for the fieldset based on hint/error ids.
   * @returns Space-separated id list or null when there is nothing to describe.
   */
  get describedBy(): string | null {
    const ids: string[] = [];

    if (this.legendHint) {
      ids.push(`${this.fieldSetId}-hint`);
    }

    if (this.errors) {
      ids.push(`${this.fieldSetId}-error-message`);
    }

    return ids.length ? ids.join(' ') : null;
  }

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.initOuterRadios();
    });
  }

  // inside the component class, after view render
  /**
   * Initializes govuk-frontend radios behavior for this component's radio group.
   * Side effects: dynamically imports govuk-frontend, mutates dataset, logs warnings on fallback.
   */
  private initOuterRadios(): void {
    const host = this.elementRef.nativeElement;
    const rootRadios = host.querySelector('.govuk-radios') as HTMLElement | null;
    if (!rootRadios) return;

    if (rootRadios.dataset['opalGovukRadiosInitialised'] === 'true') return;
    rootRadios.dataset['opalGovukRadiosInitialised'] = 'true';

    import('govuk-frontend')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((module: any) => {
        // Prefer Radios constructor for a scoped init
        const Radios = module.Radios ?? module.radios ?? module.default?.Radios;
        if (typeof Radios === 'function') {
          try {
            // scoped init for just this root
            // eslint-disable-next-line no-new
            new Radios(rootRadios);
            return;
          } catch (e) {
            console.warn('Govuk Radios constructor failed for rootRadios, falling back to initAll', e);
          }
        }

        // Fallback: prefer module.initAll({ scope }) when available
        const initAll = module.initAll ?? module.default?.initAll;
        if (typeof initAll === 'function') {
          initAll({ scope: rootRadios });
          return;
        }

        console.warn('govuk-frontend radios init not found for rootRadios', module);
      })
      .catch((err) => {
        console.error('Failed to import govuk-frontend for rootRadios init', err);
      });
  }
}
