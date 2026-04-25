import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Protege las rutas internas de la evidencia Angular usando solo su token local.
  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
