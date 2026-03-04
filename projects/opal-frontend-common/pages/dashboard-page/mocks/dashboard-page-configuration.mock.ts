import { IDashboardPageConfiguration } from '../interfaces/dashboard-page-configuration.interface';

export const DASHBOARD_PAGE_CONFIGURATION_MOCK: IDashboardPageConfiguration = {
  title: 'Dashboard',
  highlights: [
    {
      id: 'highlight1',
      text: 'Highlight 1',
      routerLink: ['/highlight1'],
      permissionId: 1,
      newTab: false,
      fragment: null,
      style: 'highlight-style-1',
    },
    {
      id: 'highlight2',
      text: 'Highlight 2',
      routerLink: ['/highlight2'],
      permissionId: 2,
      newTab: true,
      fragment: null,
      style: 'highlight-style-2',
    },
  ],
  groups: [
    {
      id: 'group1',
      title: 'Group 1',
      links: [
        {
          id: 'link1',
          text: 'Link 1',
          routerLink: ['/group1/link1'],
          permissionId: 3,
          newTab: false,
          fragment: null,
          style: 'link-style-1',
        },
        {
          id: 'link2',
          text: 'Link 2',
          routerLink: ['/group1/link2'],
          permissionId: 4,
          newTab: true,
          fragment: null,
          style: 'link-style-2',
        },
      ],
    },
    {
      id: 'group2',
      title: 'Group 2',
      links: [
        {
          id: 'link3',
          text: 'Link 3',
          routerLink: ['/group2/link3'],
          permissionId: 5,
          newTab: false,
          fragment: null,
          style: 'link-style-3',
        },
        {
          id: 'link4',
          text: 'Link 4',
          routerLink: ['/group2/link4'],
          permissionId: 6,
          newTab: true,
          fragment: null,
          style: 'link-style-4',
        },
      ],
    },
  ],
};
