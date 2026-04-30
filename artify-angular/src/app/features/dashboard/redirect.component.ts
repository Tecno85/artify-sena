import { Component } from '@angular/core';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: '',
})
/**
 * Componente auxiliar usado por la ruta raiz.
 *
 * No muestra contenido visual porque su unica funcion es permitir que
 * `redirectBySessionGuard` decida si el usuario debe ir al login o al dashboard.
 */
export class RedirectComponent {}
