import { Routes } from '@angular/router';
import { SecureInnerPagesGuard } from './guards/secure-inner-pages/secure-inner-pages.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { DetailsGuard } from './guards/details/details.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./components/detailed-form/detailed-form.component').then(
        (c) => c.DetailedFormComponent
      ),
    canActivate: [DetailsGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
