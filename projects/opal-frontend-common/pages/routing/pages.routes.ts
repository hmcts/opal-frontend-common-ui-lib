import { Routes } from '@angular/router';
import { PAGES_ROUTING_TITLES, PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { signedInGuard } from '@hmcts/opal-frontend-common/guards/signed-in';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { accountGuard } from '@hmcts/opal-frontend-common/guards/account';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: PAGES_ROUTING_PATHS.children.accessDenied,
    loadComponent: () => import('../access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard, accountGuard],
    data: { title: PAGES_ROUTING_TITLES.children.accessDenied },
    resolve: { title: TitleResolver },
  },
  {
    path: PAGES_ROUTING_PATHS.children.signIn,
    loadComponent: () => import('../sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
    data: { title: PAGES_ROUTING_TITLES.children.signIn },
    resolve: { title: TitleResolver },
  },
  {
    path: PAGES_ROUTING_PATHS.children.accountCreated,
    loadComponent: () => import('../account-created/account-created.component').then((c) => c.AccountCreated),
    canActivate: [authGuard],
    data: { title: PAGES_ROUTING_TITLES.children.accountCreated },
    resolve: { title: TitleResolver },
  },
];
