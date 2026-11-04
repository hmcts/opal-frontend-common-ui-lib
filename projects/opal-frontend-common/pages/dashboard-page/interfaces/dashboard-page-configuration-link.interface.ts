export interface IDashboardPageConfigurationLink {
  id: string;
  text: string;
  routerLink: string[];
  fragment: string | null;
  permissionCodes: string[];
  newTab: boolean;
  style: string | null;
}
