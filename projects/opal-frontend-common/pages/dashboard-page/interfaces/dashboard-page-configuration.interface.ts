import { IDashboardPageConfigurationLinkGroup } from './dashboard-page-configuration-link-group.interface';
import { IDashboardPageConfigurationLink } from './dashboard-page-configuration-link.interface';

export interface IDashboardPageConfiguration {
  title: string;
  highlights: IDashboardPageConfigurationLink[];
  groups: IDashboardPageConfigurationLinkGroup[];
}
