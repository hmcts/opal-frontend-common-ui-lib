export interface IDashboardPageConfigurationLink {
  id: string;
  text: string;
  routerLink: string[];
  fragment: string | null;
  permissionIds: number[];
  newTab: boolean;
  style: string | null;
}
