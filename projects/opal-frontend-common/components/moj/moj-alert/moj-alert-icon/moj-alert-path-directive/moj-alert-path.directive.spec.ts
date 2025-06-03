import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojAlertPathDirective } from './moj-alert-path.directive';
import { MOJ_ALERT_ICON_PATHS } from '../../constants/alert-icon-path.constant';
import { MojAlertType } from '../../constants/alert-types.constant';

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

  it('should clear previous paths when type changes', () => {
    component.type = 'information';
    fixture.detectChanges();

    // At this point, one path (descending icon) is rendered
    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(1);

    // Change direction to 'none', which should render two paths
    component.type = 'success';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_ALERT_ICON_PATHS.success);
  });
});
