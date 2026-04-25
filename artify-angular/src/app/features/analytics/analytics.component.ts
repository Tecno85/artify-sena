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
export class AnalyticsComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  data: AnalyticsBundle | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (error: HttpErrorResponse) => {
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
