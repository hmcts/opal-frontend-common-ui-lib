export interface IDashboardPageConfigurationLink {
  id: string;
  text: string;
  routerLink: string[];
  fragment: string | null;
  permissionId: number;
  newTab: boolean;
  style: string;
}
