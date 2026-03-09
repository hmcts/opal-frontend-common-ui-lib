import { IDashboardPageConfigurationLink } from './dashboard-page-configuration-link.interface';

export interface IDashboardPageConfigurationLinkGroup {
  id: string;
  title: string;
  links: IDashboardPageConfigurationLink[];
}
