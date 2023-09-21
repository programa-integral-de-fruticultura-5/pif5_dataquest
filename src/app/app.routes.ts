import { Routes } from '@angular/router';
import { SecureInnerPagesGuard } from './guards/secure-inner-pages/secure-inner-pages.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { DetailsGuard } from './guards/details/details.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.routes').then((m) => m.routes),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'detail',
    loadComponent: () =>
      import('./pages/detail/detail.page').then((m) => m.DetailPage),
    canActivate: [DetailsGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
