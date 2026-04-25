import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard usado por la ruta raiz para decidir el primer destino del usuario.
 *
 * Si ya hay token, evita mostrar el login nuevamente y envia al dashboard; si
 * no hay sesion, dirige al formulario de autenticacion.
 */
export const redirectBySessionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? router.createUrlTree(['/dashboard'])
    : router.createUrlTree(['/login']);
};
