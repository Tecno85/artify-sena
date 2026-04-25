import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard principal de seguridad para rutas internas de la evidencia Angular.
 *
 * Permite navegar solo cuando existe un token guardado por AuthService; en caso
 * contrario redirige al login propio de Angular.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
