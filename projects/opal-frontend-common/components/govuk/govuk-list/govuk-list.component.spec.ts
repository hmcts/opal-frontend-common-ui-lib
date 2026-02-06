import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GovukListComponent } from './govuk-list.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('GovukListComponent', () => {
  let component: GovukListComponent;
  let fixture: ComponentFixture<GovukListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a <ul> with class govuk-list', () => {
    const ulElement = fixture.debugElement.query(By.css('ul.govuk-list'));
    expect(ulElement).toBeTruthy();
  });
});
