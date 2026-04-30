import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { redirectBySessionGuard } from './core/guards/redirect-by-session.guard';

/**
 * Configuracion principal de rutas de la evidencia Angular.
 *
 * Este arreglo define que componente se carga para cada URL y que rutas
 * requieren autenticacion antes de permitir el acceso del usuario.
 */
export const routes: Routes = [
  {
    // Ruta inicial: decide si el usuario va al login o al dashboard segun su sesion.
    path: '',
    pathMatch: 'full',
    canActivate: [redirectBySessionGuard],
    loadComponent: () =>
      import('./features/dashboard/redirect.component').then((m) => m.RedirectComponent),
  },
  {
    // Ruta publica: muestra el formulario de autenticacion de la app Angular.
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Ruta privada: solo se muestra cuando AuthGuard detecta un token en sessionStorage.
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    // Ruta privada: consume y presenta los datos reales de la API REST de analytics.
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    // Cualquier URL no definida vuelve al flujo inicial para evitar pantallas vacias.
    path: '**',
    redirectTo: '',
  },
];
