import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { redirectBySessionGuard } from './core/guards/redirect-by-session.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectBySessionGuard],
    loadComponent: () =>
      import('./features/dashboard/redirect.component').then((m) => m.RedirectComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
