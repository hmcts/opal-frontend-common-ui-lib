import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojAlertPathDirective } from './moj-alert-path.directive';
import { MojAlertType } from '../../constants/alert-types.constant';
import { MOJ_ALERT_ICON_PATHS } from '../moj-alert-path-directive/constants/alert-icon-path.constant';
@Component({
  template: ` <svg [opalLibMojAlertSortIcon]="type"></svg> `,
  standalone: true,
  imports: [MojAlertPathDirective],
})
class TestHostComponent {
  type: MojAlertType = 'information';
}

describe('MoJAlertPathDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should render success icon path when type is success', () => {
    component.type = 'success';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.success);
  });

  it('should render information icon path when type is information', () => {
    component.type = 'information';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.information);
  });

  it('should render warning icon path when type is warning', () => {
    component.type = 'warning';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.warning);
  });

  it('should render error icon path when type is error', () => {
    component.type = 'error';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.error);
  });

  it('should render fallback information icon path when type is invalid', () => {
    component.type = 'invalid' as MojAlertType;
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.information);
  });

  it('should clear previous paths when type changes', () => {
    component.type = 'information';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(1);

    component.type = 'success';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.success);
  });
});
