import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'forms',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'forms',
        loadComponent: () =>
          import('../forms/forms.page').then((m) => m.FormsPage),
      },
      {
        path: 'drafts',
        loadComponent: () =>
          import('../drafts/drafts.page').then((m) => m.DraftsPage),
      },
      {
        path: 'surveys',
        loadComponent: () =>
          import('../surveys/surveys.page').then((m) => m.SurveysPage),
      }
    ]
  }
];
