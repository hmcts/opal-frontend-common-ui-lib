import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IDashboardPageConfiguration } from './interfaces/dashboard-page-configuration.interface';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let getUniquePermissionsMock: ReturnType<typeof vi.fn>;
  let userStateMock: ReturnType<typeof vi.fn>;

  const userState = { business_unit_users: [] };

  const dashboardConfig: IDashboardPageConfiguration = {
    title: 'Dashboard',
    highlights: [
      {
        id: 'highlight-styled',
        text: 'Styled highlight',
        routerLink: ['/reports', '0', 'summary-list'],
        fragment: null,
        permissionId: 101,
        newTab: false,
        style: 'govuk-lighter-blue-background-colour',
      },
      {
        id: 'highlight-plain',
        text: 'Plain highlight',
        routerLink: ['/reports', '1', 'summary-list'],
        fragment: 'reports-fragment',
        permissionId: 102,
        newTab: true,
        style: '',
      },
    ],
    groups: [
      {
        id: 'group-operational-reports',
        title: 'Operational reports',
        links: [
          {
            id: 'link-allowed',
            text: 'Allowed link',
            routerLink: ['/reports', '2', 'summary-list'],
            fragment: null,
            permissionId: 201,
            newTab: false,
            style: '',
          },
          {
            id: 'link-new-tab',
            text: 'New tab link',
            routerLink: ['/reports', '3', 'summary-list'],
            fragment: 'payment',
            permissionId: 202,
            newTab: true,
            style: '',
          },
        ],
      },
    ],
  };

  async function renderWithPermissions(permissionIds: number[]): Promise<void> {
    getUniquePermissionsMock.mockReturnValue(permissionIds);
    fixture.componentRef.setInput('dashboardConfig', dashboardConfig);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    getUniquePermissionsMock = vi.fn().mockReturnValue([]);
    userStateMock = vi.fn().mockReturnValue(userState);

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        {
          provide: PermissionsService,
          useValue: {
            getUniquePermissions: getUniquePermissionsMock,
          },
        },
        {
          provide: GlobalStore,
          useValue: {
            userState: userStateMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dashboard title', async () => {
    await renderWithPermissions([101, 102, 201, 202]);

    const title = fixture.nativeElement.querySelector('h1.govuk-heading-l');
    expect(title.textContent?.trim()).toBe('Dashboard');
  });

  it('should fetch permissions using the current user state', async () => {
    await renderWithPermissions([101]);

    expect(getUniquePermissionsMock).toHaveBeenCalled();
    expect(getUniquePermissionsMock).toHaveBeenCalledWith(userState);
  });

  it('should filter highlights and links by permissions', async () => {
    await renderWithPermissions([101, 201]);

    expect(fixture.nativeElement.querySelector('#highlight-styled')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#link-allowed')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#highlight-plain')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('#link-new-tab')).toBeFalsy();
  });

  it('should not render an empty highlights section when no highlight permissions are available', async () => {
    await renderWithPermissions([201]);

    const dashboardLists = fixture.nativeElement.querySelectorAll('ul.govuk-list');

    expect(fixture.nativeElement.querySelector('#highlight-styled')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('#highlight-plain')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('#link-allowed')).toBeTruthy();
    expect(dashboardLists).toHaveLength(1);
  });

  it('should not render an empty group section when no group links are permitted', async () => {
    await renderWithPermissions([101]);

    const dashboardLists = fixture.nativeElement.querySelectorAll('ul.govuk-list');

    expect(fixture.nativeElement.querySelector('#highlight-styled')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h2.govuk-heading-m')).toBeFalsy();
    expect(dashboardLists).toHaveLength(1);
  });

  it('should wrap styled highlights in inset text', async () => {
    await renderWithPermissions([101]);

    const insetWrapper = fixture.nativeElement.querySelector('#highlight-styled_inset_text');
    const styledLink = fixture.nativeElement.querySelector('#highlight-styled');

    expect(insetWrapper).toBeTruthy();
    expect(styledLink).toBeTruthy();
  });

  it('should not wrap non-styled highlights in inset text', async () => {
    await renderWithPermissions([102]);

    const plainInsetWrapper = fixture.nativeElement.querySelector('#highlight-plain_inset_text');
    const plainLink = fixture.nativeElement.querySelector('#highlight-plain');

    expect(plainInsetWrapper).toBeFalsy();
    expect(plainLink).toBeTruthy();
  });

  it('should apply new-tab attributes and fragment to highlight links', async () => {
    await renderWithPermissions([102]);

    const link = fixture.nativeElement.querySelector('#highlight-plain');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toContain('#reports-fragment');
  });

  it('should apply new-tab attributes and fragment to group links', async () => {
    await renderWithPermissions([202]);

    const link = fixture.nativeElement.querySelector('#link-new-tab');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toContain('#payment');
  });

  it('should use safe same-tab target and no rel attributes for non-new-tab links', async () => {
    await renderWithPermissions([101, 201]);

    const highlightLink = fixture.nativeElement.querySelector('#highlight-styled');
    const groupLink = fixture.nativeElement.querySelector('#link-allowed');

    expect(highlightLink.getAttribute('target')).toBe('_self');
    expect(highlightLink.getAttribute('rel')).toBeNull();
    expect(groupLink.getAttribute('target')).toBe('_self');
    expect(groupLink.getAttribute('rel')).toBeNull();
  });

  it('should render duplicate labels safely when item ids are unique', async () => {
    const duplicateTextDashboardConfig: IDashboardPageConfiguration = {
      title: 'Dashboard',
      highlights: [
        {
          id: 'duplicate-highlight-1',
          text: 'Duplicate label',
          routerLink: ['/reports', '0', 'summary-list'],
          fragment: null,
          permissionId: 101,
          newTab: false,
          style: '',
        },
        {
          id: 'duplicate-highlight-2',
          text: 'Duplicate label',
          routerLink: ['/reports', '1', 'summary-list'],
          fragment: null,
          permissionId: 102,
          newTab: false,
          style: '',
        },
      ],
      groups: [
        {
          id: 'duplicate-group-1',
          title: 'Duplicate group title',
          links: [
            {
              id: 'duplicate-link-1',
              text: 'Duplicate link label',
              routerLink: ['/reports', '2', 'summary-list'],
              fragment: null,
              permissionId: 201,
              newTab: false,
              style: '',
            },
          ],
        },
        {
          id: 'duplicate-group-2',
          title: 'Duplicate group title',
          links: [
            {
              id: 'duplicate-link-2',
              text: 'Duplicate link label',
              routerLink: ['/reports', '3', 'summary-list'],
              fragment: null,
              permissionId: 202,
              newTab: false,
              style: '',
            },
          ],
        },
      ],
    };

    getUniquePermissionsMock.mockReturnValue([101, 102, 201, 202]);
    fixture.componentRef.setInput('dashboardConfig', duplicateTextDashboardConfig);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const duplicateGroupTitles = fixture.nativeElement.querySelectorAll('h2.govuk-heading-m');

    expect(duplicateGroupTitles).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('#duplicate-highlight-1')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#duplicate-highlight-2')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#duplicate-link-1')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#duplicate-link-2')).toBeTruthy();
  });
});
