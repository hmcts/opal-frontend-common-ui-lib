import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukFooterComponent } from './govuk-footer.component';
import { GOVUK_FOOTER_LINKS_MOCK } from './mocks/govuk-footer-links.mock';

describe('GovukFooterComponent', () => {
  let component: GovukFooterComponent | null;
  let fixture: ComponentFixture<GovukFooterComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukFooterComponent);
    component = fixture.componentInstance;

    component.footerLinks = GOVUK_FOOTER_LINKS_MOCK;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
