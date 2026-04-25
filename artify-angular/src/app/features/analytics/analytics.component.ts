import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import {
  AnalyticsBundle,
  AnalyticsService,
} from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
/**
 * Vista protegida que presenta los indicadores de analytics de Artify.
 *
 * Consume datos reales mediante AnalyticsService y muestra estados de carga o
 * error cuando el backend Express/MySQL no esta disponible.
 */
export class AnalyticsComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  data: AnalyticsBundle | null = null;
  isLoading = true;
  errorMessage = '';

  /**
   * Carga los indicadores tan pronto como Angular inicializa la pantalla.
   */
  ngOnInit(): void {
    this.loadAnalytics();
  }

  /**
   * Consulta nuevamente la API REST de analytics y actualiza los estados de UI
   * sin usar datos de demostracion.
   */
  loadAnalytics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (error: HttpErrorResponse) => {
        // Se conserva el mensaje del backend cuando existe; si no, se explica la dependencia del servidor.
        this.errorMessage =
          error.error?.mensaje ??
          'No fue posible consultar analytics. Confirma que el backend este activo en http://localhost:3000.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
