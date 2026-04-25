import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

export interface ApiEnvelope<T> {
  ok?: boolean;
  mensaje: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface FiltroPopular {
  filtro: string;
  usos: number;
  porcentaje: number;
}

export interface HorarioEdicion {
  hora: number;
  cantidad_ediciones: number;
  porcentaje: number;
}

export interface FormatoPreferido {
  formato: string;
  descargas: number;
  porcentaje: number;
}

export interface ConversionData {
  tasa_conversion_porcentaje: string;
  total_sesiones: number;
  sesiones_exitosas: number;
}

export interface AnalyticsBundle {
  filtros: ApiEnvelope<{ filtros: FiltroPopular[] }>;
  horarios: ApiEnvelope<{ horarios: HorarioEdicion[] }>;
  formatos: ApiEnvelope<{ formatos: FormatoPreferido[] }>;
  conversion: ApiEnvelope<{ conversionData: ConversionData }>;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1/analytics';

  // Centraliza el consumo de la API real para que los componentes no conozcan URLs.
  getAnalytics(): Observable<AnalyticsBundle> {
    return forkJoin({
      filtros: this.http.get<ApiEnvelope<{ filtros: FiltroPopular[] }>>(
        `${this.apiUrl}/filtros-populares`,
      ),
      horarios: this.http.get<ApiEnvelope<{ horarios: HorarioEdicion[] }>>(
        `${this.apiUrl}/horarios-edicion`,
      ),
      formatos: this.http.get<ApiEnvelope<{ formatos: FormatoPreferido[] }>>(
        `${this.apiUrl}/formatos-preferidos`,
      ),
      conversion: this.http.get<ApiEnvelope<{ conversionData: ConversionData }>>(
        `${this.apiUrl}/tasa-conversion`,
      ),
    });
  }
}
