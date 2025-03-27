import { Routes } from '@angular/router';
import { PAGES_ROUTING_TITLES, PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/core/constants';
import { authGuard, signedInGuard } from '@hmcts/opal-frontend-common/core/guards';
import { TitleResolver, userStateResolver } from '@hmcts/opal-frontend-common/core/resolvers';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: PAGES_ROUTING_PATHS.children.accessDenied,
    loadComponent: () => import('../access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
    data: { title: PAGES_ROUTING_TITLES.children.accessDenied },
    resolve: { userState: userStateResolver, title: TitleResolver },
  },
  {
    path: PAGES_ROUTING_PATHS.children.signIn,
    loadComponent: () => import('../sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
    data: { title: PAGES_ROUTING_TITLES.children.signIn },
    resolve: { title: TitleResolver },
  },
];
