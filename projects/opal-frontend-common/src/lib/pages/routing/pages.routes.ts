import { Routes } from '@angular/router';
import { PAGES_ROUTING_TITLES } from './constants/routing-titles.constant';
import { PAGES_ROUTING_PATHS } from './constants/routing-paths.constant';
import { authGuard } from '../../guards';
import { userStateResolver } from '../../resolvers/user-state/user-state.resolver';
import { TitleResolver } from '../../resolvers/title/title.resolver';
import { signedInGuard } from '../../guards/signed-in/signed-in.guard';

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
