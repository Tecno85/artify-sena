import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export interface ArtifyUser {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: 'usuario' | 'admin' | string;
}

interface LoginResponse {
  mensaje: string;
  usuario: ArtifyUser;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio responsable de la autenticacion dentro de la evidencia Angular.
 *
 * Consume el login real del backend de Artify y mantiene la sesion en
 * sessionStorage usando llaves propias, para no interferir con el frontend
 * original ni con `frontend/pages/login.html`.
 */
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'artifyAngularToken';
  private readonly userKey = 'artifyAngularUser';
  private readonly userSubject = new BehaviorSubject<ArtifyUser | null>(this.readStoredUser());

  readonly user$ = this.userSubject.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map((user) => Boolean(user && this.getToken())));

  /**
   * Envia las credenciales al endpoint real de Artify y persiste la sesion
   * cuando el backend responde con usuario y token validos.
   */
  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((response) => {
        // La evidencia Angular guarda su sesion con llaves propias para no interferir con login.html.
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userKey, JSON.stringify(response.usuario));
        this.userSubject.next(response.usuario);
      }),
    );
  }

  /**
   * Cierra la sesion de la evidencia Angular eliminando solamente sus llaves
   * locales de sessionStorage.
   */
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  /**
   * Expone el token actual para guards o futuros interceptores HTTP.
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Valida si existe una sesion Angular activa a partir del token guardado.
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  /**
   * Reconstruye el usuario desde sessionStorage al recargar el navegador.
   * Si el dato almacenado no es JSON valido, se limpia para evitar estados rotos.
   */
  private readStoredUser(): ArtifyUser | null {
    const rawUser = sessionStorage.getItem(this.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as ArtifyUser;
    } catch {
      sessionStorage.removeItem(this.userKey);
      return null;
    }
  }
}
