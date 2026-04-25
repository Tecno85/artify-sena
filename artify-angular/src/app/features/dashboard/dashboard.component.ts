import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
/**
 * Vista protegida inicial despues del login.
 *
 * Presenta un resumen academico de la sesion activa, el backend conectado y la
 * proteccion de rutas implementada con AuthGuard.
 */
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  readonly user$ = this.authService.user$;
}
