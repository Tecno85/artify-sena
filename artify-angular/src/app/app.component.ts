import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
/**
 * Componente raiz de la evidencia Angular.
 *
 * Contiene el layout general, muestra la navegacion solo cuando existe sesion
 * y delega el cierre de sesion al servicio de autenticacion.
 */
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$ = this.authService.user$;
  readonly isLoggedIn$ = this.authService.isLoggedIn$;

  /**
   * Finaliza la sesion local y devuelve al usuario al login de Angular.
   */
  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
